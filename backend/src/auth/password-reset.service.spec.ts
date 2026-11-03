import { createHash } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { DataSource, EntityManager } from 'typeorm';
import type { AuditService } from '../audit/audit.service.js';
import type { MailService } from '../mail/mail.service.js';
import type { User } from '../users/user.entity.js';
import type { UsersService } from '../users/users.service.js';
import { PasswordResetService } from './password-reset.service.js';

const user = {
  id: 'user-1',
  email: 'owner@kubagest.io',
  firstName: 'Hector',
  isActive: true,
} as User;

type StoredToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
};

function hashSecret(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function createService(options?: {
  found?: User | null;
  send?: (mail: { to: string; subject: string; text: string }) => Promise<void>;
}) {
  const found = options && 'found' in options ? options.found : user;
  const sent: Array<{ to: string; text: string }> = [];
  let row: StoredToken | null = null;
  let consumedAfterFailure = false;
  const passwords: string[] = [];

  const apply = (patch: Partial<StoredToken>) => {
    if (row) {
      row = { ...row, ...patch };
    }
  };

  const manager = {
    update: async (
      _entity: unknown,
      criteria: { userId?: string; id?: string },
      patch: Partial<StoredToken> & { passwordHash?: string },
    ) => {
      if (patch.passwordHash) {
        passwords.push(patch.passwordHash);
        return;
      }
      if (
        criteria.userId &&
        row?.userId === criteria.userId &&
        !row.consumedAt
      ) {
        apply({ consumedAt: new Date() });
        return;
      }
      if (criteria.id && row?.id === criteria.id) {
        apply(patch);
      }
    },
    create: (_entity: unknown, value: StoredToken) => value,
    save: async (value: StoredToken) => {
      row = { ...value, consumedAt: null };
      return row;
    },
    findOne: async (
      _entity: unknown,
      query: { where: { tokenHash?: string; id?: string } },
    ) => {
      if (query.where.id && query.where.id === user.id) {
        return found;
      }
      if (!row || row.consumedAt) {
        return null;
      }
      if (query.where.tokenHash && query.where.tokenHash !== row.tokenHash) {
        return null;
      }
      return row;
    },
  } as unknown as EntityManager;

  const tokens = {
    update: async (id: string, patch: Partial<StoredToken>) => {
      if (row?.id === id) {
        apply(patch);
        consumedAfterFailure = patch.consumedAt != null;
      }
    },
    findOne: async (query: {
      where: { userId?: string; tokenHash?: string };
    }) => {
      if (!row || row.consumedAt) {
        return null;
      }
      if (query.where.userId && query.where.userId !== row.userId) {
        return null;
      }
      if (query.where.tokenHash && query.where.tokenHash !== row.tokenHash) {
        return null;
      }
      return row;
    },
  };

  const dataSource = {
    transaction: async <T>(work: (manager: EntityManager) => Promise<T>) =>
      work(manager),
    getRepository: () => tokens,
  } as unknown as DataSource;

  const users = {
    findByEmail: async () => found ?? null,
  } as unknown as UsersService;

  const mail = {
    send: async (message: { to: string; subject: string; text: string }) => {
      if (options?.send) {
        await options.send(message);
        return;
      }
      sent.push(message);
    },
  } as unknown as MailService;

  const audit = { record: async () => undefined } as unknown as AuditService;

  return {
    service: new PasswordResetService(users, dataSource, mail, audit),
    sent,
    passwords,
    consumedAfterFailure: () => consumedAfterFailure,
    expire() {
      if (row) {
        row = { ...row, expiresAt: new Date(Date.now() - 1000) };
      }
    },
  };
}

function codeFrom(text: string): string {
  const match = text.match(/Votre code KubaGest est (\d{6})/);
  if (!match?.[1]) {
    throw new Error('code absent du message');
  }
  return match[1];
}

describe('PasswordResetService', () => {
  it('refuse une adresse inconnue sans envoyer de message', async () => {
    const { service, sent } = createService({ found: null });

    await expect(service.request('inconnu@kubagest.io')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(sent).toHaveLength(0);
  });

  it('refuse un compte désactivé', async () => {
    const { service, sent } = createService({
      found: { ...user, isActive: false },
    });

    await expect(service.request(user.email)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(sent).toHaveLength(0);
  });

  it('envoie un code à 6 chiffres pour un compte actif', async () => {
    const { service, sent } = createService();

    await expect(service.request('  Owner@KubaGest.io ')).resolves.toEqual({
      sent: true,
    });

    expect(sent).toHaveLength(1);
    expect(sent[0]?.to).toBe(user.email);
    expect(sent[0]?.text).toMatch(/Votre code KubaGest est \d{6}/);
    expect(sent[0]?.text).not.toMatch(/[a-f0-9]{64}/);
  });

  it('retire le code lorsque l’envoi échoue', async () => {
    const { service, consumedAfterFailure } = createService({
      send: async () => {
        throw new Error('smtp');
      },
    });

    await expect(service.request(user.email)).rejects.toThrow('smtp');
    expect(consumedAfterFailure()).toBe(true);
  });

  it('reconnaît le code puis enregistre le nouveau mot de passe', async () => {
    const harness = createService();
    await harness.service.request(user.email);
    const code = codeFrom(harness.sent[0]?.text ?? '');

    const verified = await harness.service.verify(user.email, code);
    expect(verified.resetToken.length).toBeGreaterThan(20);

    await expect(
      harness.service.verify(user.email, code),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      harness.service.confirm(verified.resetToken, 'NouveauMotDePasse123!'),
    ).resolves.toEqual({ updated: true });
    expect(harness.passwords).toHaveLength(1);
    expect(harness.passwords[0]).not.toBe('NouveauMotDePasse123!');
  });

  it('refuse un code expiré', async () => {
    const harness = createService();
    await harness.service.request(user.email);
    const code = codeFrom(harness.sent[0]?.text ?? '');
    harness.expire();

    await expect(
      harness.service.verify(user.email, code),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
