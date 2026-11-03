import {
  createHash,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { hashPassword } from '../common/password.js';
import { MailService } from '../mail/mail.service.js';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AccessToken } from './access-token.entity.js';
import { AccessTokenPurpose } from './auth-token.enums.js';

const RESET_TTL_MS = 15 * 60 * 1000;

/**
 * Envoie un code à 6 chiffres uniquement à un compte actif, puis autorise
 * le choix d'un nouveau mot de passe une fois ce code reconnu.
 */
@Injectable()
export class PasswordResetService {
  constructor(
    private readonly users: UsersService,
    private readonly dataSource: DataSource,
    private readonly mail: MailService,
    private readonly audit: AuditService,
  ) {}

  async request(email: string): Promise<{ sent: true }> {
    const user = await this.requireActiveUser(email);
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const tokenId = await this.storeSecret(user, code);

    try {
      await this.mail.send({
        to: user.email,
        subject: 'Votre code KubaGest',
        text: this.message(user, code),
      });
    } catch (error) {
      await this.dataSource
        .getRepository(AccessToken)
        .update(tokenId, { consumedAt: new Date() });
      throw error;
    }

    return { sent: true };
  }

  async verify(email: string, code: string): Promise<{ resetToken: string }> {
    const user = await this.requireActiveUser(email);
    const record = await this.findOpenToken(user.id);
    const presented = hashSecret(code.trim());

    if (
      !record ||
      record.expiresAt.getTime() <= Date.now() ||
      !sameSecret(record.tokenHash, presented)
    ) {
      throw new BadRequestException('Ce code est incorrect ou expiré.');
    }

    const resetToken = randomBytes(32).toString('base64url');
    await this.dataSource.getRepository(AccessToken).update(record.id, {
      tokenHash: hashSecret(resetToken),
      expiresAt: new Date(Date.now() + RESET_TTL_MS),
    });

    return { resetToken };
  }

  async confirm(
    resetToken: string,
    password: string,
  ): Promise<{ updated: true }> {
    const tokenHash = hashSecret(resetToken);

    await this.dataSource.transaction(async (manager) => {
      const record = await manager.findOne(AccessToken, {
        where: {
          tokenHash,
          purpose: AccessTokenPurpose.PASSWORD_RESET,
          consumedAt: IsNull(),
        },
      });

      if (!record || record.expiresAt.getTime() <= Date.now()) {
        throw new BadRequestException(
          'Ce code n’est plus valable. Demandez-en un nouveau.',
        );
      }

      const user = await manager.findOne(User, {
        where: { id: record.userId },
      });
      if (!user?.isActive) {
        throw new ForbiddenException('Ce compte est désactivé.');
      }

      await manager.update(
        User,
        { id: user.id },
        {
          passwordHash: await hashPassword(password),
          passwordChangedAt: new Date(),
        },
      );
      await manager.update(
        AccessToken,
        { id: record.id },
        { consumedAt: new Date() },
      );
      await this.audit.record(
        {
          action: 'auth.password_reset_completed',
          entityType: 'user',
          entityId: user.id,
          actorId: user.id,
        },
        manager,
      );
    });

    return { updated: true };
  }

  private async requireActiveUser(email: string): Promise<User> {
    const user = await this.users.findByEmail(email.trim().toLowerCase());

    if (!user) {
      throw new NotFoundException(
        'Aucun compte n’existe avec cette adresse email.',
      );
    }

    if (!user.isActive) {
      throw new ForbiddenException('Ce compte est désactivé.');
    }

    return user;
  }

  private async storeSecret(user: User, secret: string): Promise<string> {
    return this.dataSource.transaction(async (manager) => {
      await manager.update(
        AccessToken,
        {
          userId: user.id,
          purpose: AccessTokenPurpose.PASSWORD_RESET,
          consumedAt: IsNull(),
        },
        { consumedAt: new Date() },
      );

      const saved = await manager.save(
        manager.create(AccessToken, {
          userId: user.id,
          tenantId: null,
          purpose: AccessTokenPurpose.PASSWORD_RESET,
          tokenHash: hashSecret(secret),
          expiresAt: new Date(Date.now() + RESET_TTL_MS),
          consumedAt: null,
          createdBy: user.id,
        }),
      );

      await this.audit.record(
        {
          action: 'auth.password_reset_requested',
          entityType: 'user',
          entityId: user.id,
          actorId: user.id,
          newValues: { email: user.email },
        },
        manager,
      );

      return saved.id;
    });
  }

  private findOpenToken(userId: string): Promise<AccessToken | null> {
    return this.dataSource.getRepository(AccessToken).findOne({
      where: {
        userId,
        purpose: AccessTokenPurpose.PASSWORD_RESET,
        consumedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  private message(user: User, code: string): string {
    const greeting = user.firstName ? `Bonjour ${user.firstName},` : 'Bonjour,';

    return [
      greeting,
      '',
      `Votre code KubaGest est ${code}.`,
      'Il est valable 15 minutes. Saisissez-le dans l’application pour choisir un nouveau mot de passe.',
      '',
      "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.",
    ].join('\n');
  }
}

function hashSecret(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function sameSecret(stored: string, presented: string): boolean {
  const left = Buffer.from(stored);
  const right = Buffer.from(presented);
  return left.length === right.length && timingSafeEqual(left, right);
}
