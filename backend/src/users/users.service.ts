import { createHash, randomBytes } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { AuthSession } from '../auth/auth-session.entity.js';
import { AccessToken } from '../auth/access-token.entity.js';
import { AccessTokenPurpose } from '../auth/auth-token.enums.js';
import { AuditService } from '../audit/audit.service.js';
import { hashPassword } from '../common/password.js';
import type { Environment } from '../config/env.validation.js';
import { MailService } from '../mail/mail.service.js';
import { Establishment } from '../tenants/entities/establishment.entity.js';
import { Tenant } from '../tenants/entities/tenant.entity.js';
import { Subscription } from '../tenants/entities/subscription.entity.js';
import { ASSIGNABLE_ROLES, CreateMemberDto } from './dto/create-member.dto.js';
import { CreateMemberResponseDto } from './dto/create-member-response.dto.js';
import { TenantMemberDto } from './dto/tenant-member.dto.js';
import {
  ResetMemberPasswordDto,
  SetMemberPermissionDto,
  UpdateMemberRoleDto,
  UpdateMemberStatusDto,
} from './dto/manage-member.dto.js';
import { Membership } from './membership.entity.js';
import { MembershipPermission } from './membership-permission.entity.js';
import { MEMBER_PERMISSION_CODES } from './member-permissions.js';
import { MembershipRole } from './membership-role.enum.js';
import {
  MembershipViewDto,
  ProfileResponseDto,
  UserResponseDto,
  mapUserResponse,
} from './user.mapper.js';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Membership)
    private readonly memberships: Repository<Membership>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Establishment)
    private readonly establishments: Repository<Establishment>,
    @InjectRepository(MembershipPermission)
    private readonly permissions: Repository<MembershipPermission>,
    @InjectRepository(AuthSession)
    private readonly authSessions: Repository<AuthSession>,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
    private readonly mail: MailService,
    private readonly config: ConfigService<Environment, true>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  /**
   * Résout le rattachement tenant de l'utilisateur.
   * Lorsqu'aucun tenant n'est demandé, le premier rattachement actif sert de
   * contexte par défaut (mono-boutique dans le MVP).
   */
  findMembership(
    userId: string,
    tenantId?: string,
  ): Promise<Membership | null> {
    return this.memberships.findOne({
      where: tenantId
        ? { userId, tenantId, isActive: true }
        : { userId, isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  findMemberships(userId: string): Promise<Membership[]> {
    return this.memberships.find({
      where: { userId, isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async buildProfile(user: User): Promise<ProfileResponseDto> {
    const memberships = await this.findMemberships(user.id);
    const views = await this.describeMemberships(memberships);

    return {
      ...mapUserResponse(user),
      memberships: views,
    };
  }

  async describeMembership(membership: Membership): Promise<MembershipViewDto> {
    const [view] = await this.describeMemberships([membership]);
    return view;
  }

  /** Utilisateurs rattachés à un tenant, filtrés côté serveur (isolation). */
  async listTenantMembers(tenantId: string): Promise<TenantMemberDto[]> {
    const memberships = await this.memberships.find({
      where: { tenantId },
      order: { createdAt: 'ASC' },
    });

    if (memberships.length === 0) {
      return [];
    }

    const users = await this.users.find({
      where: { id: In(memberships.map((membership) => membership.userId)) },
    });
    const invitations = await this.dataSource.getRepository(AccessToken).find({
      where: {
        tenantId,
        userId: In(memberships.map((membership) => membership.userId)),
        purpose: AccessTokenPurpose.INVITATION,
        consumedAt: IsNull(),
      },
    });
    const invitedUserIds = new Set(
      invitations
        .filter((invitation) => invitation.expiresAt.getTime() > Date.now())
        .map((invitation) => invitation.userId),
    );
    const usersById = new Map(users.map((user) => [user.id, user]));

    return memberships.flatMap((membership) => {
      const user = usersById.get(membership.userId);
      return user
        ? [
            {
              membershipId: membership.id,
              userId: user.id,
              email: user.email,
              firstName: user.firstName ?? '',
              lastName: user.lastName ?? '',
              sex: user.sex,
              phone: user.phone,
              avatarKey: user.avatarKey,
              role: membership.role,
              isActive: membership.isActive,
              invitationPending: invitedUserIds.has(user.id),
              createdAt: membership.createdAt,
              updatedAt: membership.updatedAt,
            },
          ]
        : [];
    });
  }

  /**
   * Crée ou rattache un utilisateur au tenant du propriétaire connecté.
   * Le tenantId provient du jeton, jamais du corps de la requête.
   */
  async createMember(
    tenantId: string,
    actorId: string,
    dto: CreateMemberDto,
  ): Promise<CreateMemberResponseDto> {
    if (!ASSIGNABLE_ROLES.includes(dto.role)) {
      throw new ForbiddenException(
        'Ce rôle ne peut pas être attribué depuis cette route',
      );
    }

    const email = dto.email.trim().toLowerCase();
    const publicUrl = this.config.get('APP_PUBLIC_URL', { infer: true });
    if (!publicUrl) {
      throw new BadRequestException(
        'APP_PUBLIC_URL doit être configurée pour envoyer une invitation',
      );
    }
    const invitationToken = randomBytes(32).toString('base64url');
    const passwordHash = await hashPassword(
      randomBytes(32).toString('base64url'),
    );
    const activationUrl = `${publicUrl}/invitation?token=${encodeURIComponent(invitationToken)}`;

    const pending = await this.dataSource.transaction(async (manager) => {
      const subscription = await manager.findOne(Subscription, {
        where: { tenantId },
        relations: { plan: true },
        order: { startsAt: 'DESC' },
      });
      const employeeLimit =
        subscription?.employeeLimit ?? subscription?.plan?.maxEmployees ?? null;
      if (employeeLimit !== null) {
        const tenantMemberships = await manager.find(Membership, {
          where: { tenantId },
        });
        const employeeCount = tenantMemberships.filter(
          (item) => item.role !== MembershipRole.OWNER,
        ).length;
        if (employeeCount >= employeeLimit) {
          throw new ForbiddenException(
            `La limite de ${employeeLimit} employé(s) de l’abonnement est atteinte`,
          );
        }
      }

      let user = await manager.findOne(User, { where: { email } });

      if (user) {
        const existing = await manager.findOne(Membership, {
          where: { tenantId, userId: user.id },
        });
        if (existing) {
          throw new ConflictException(
            'Cet utilisateur appartient déjà à cet établissement',
          );
        }
        if (user.sex !== dto.sex) {
          user.sex = dto.sex;
          user = await manager.save(user);
        }
      } else {
        user = await manager.save(
          manager.create(User, {
            email,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            sex: dto.sex,
            phone: dto.phone?.trim() || null,
            passwordHash,
            isActive: false,
            isPlatformAdmin: false,
          }),
        );
      }

      const membership = await manager.save(
        manager.create(Membership, {
          tenantId,
          userId: user.id,
          role: dto.role,
          isActive: false,
        }),
      );

      await manager.update(
        AccessToken,
        {
          userId: user.id,
          tenantId,
          purpose: AccessTokenPurpose.INVITATION,
          consumedAt: IsNull(),
        },
        { consumedAt: new Date() },
      );
      await manager.save(
        manager.create(AccessToken, {
          userId: user.id,
          tenantId,
          purpose: AccessTokenPurpose.INVITATION,
          tokenHash: hashInvitationToken(invitationToken),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          consumedAt: null,
          createdBy: actorId,
        }),
      );

      await this.audit.record(
        {
          action: 'membership.created',
          entityType: 'membership',
          entityId: `${tenantId}:${user.id}`,
          tenantId,
          actorId,
          newValues: {
            email,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            sex: dto.sex,
            role: dto.role,
            invitationPending: true,
          },
        },
        manager,
      );

      const tenant = await manager.findOne(Tenant, { where: { id: tenantId } });

      return {
        member: {
          membershipId: membership.id,
          userId: user.id,
          email: user.email,
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          sex: user.sex,
          phone: user.phone,
          avatarKey: user.avatarKey,
          role: dto.role,
          isActive: false,
          invitationPending: true,
          createdAt: membership.createdAt,
          updatedAt: membership.updatedAt,
        },
        mail: {
          to: user.email,
          subject: `Invitation à rejoindre ${tenant?.name ?? 'KubaGest'}`,
          text: [
            `Bonjour ${user.firstName || ''},`.trim(),
            '',
            `${tenant?.name ?? 'Un établissement'} vous invite à rejoindre KubaGest en tant que ${memberRoleLabel(dto.role, dto.sex)}.`,
            'Choisissez votre mot de passe en ouvrant ce lien :',
            activationUrl,
            '',
            'Ce lien est personnel, utilisable une seule fois et expire dans 48 heures.',
          ].join('\n'),
        },
      };
    });

    let invitationEmailSent = false;
    try {
      await this.mail.send(pending.mail);
      invitationEmailSent = true;
    } catch (error) {
      this.logger.warn(
        `Invitation créée mais email non envoyé (${pending.mail.to}) : ${
          error instanceof Error ? error.message : 'erreur inconnue'
        }`,
      );
    }

    return {
      ...pending.member,
      invitationEmailSent,
      invitationUrl: activationUrl,
    };
  }

  async acceptInvitation(
    token: string,
    password: string,
  ): Promise<{ activated: true }> {
    const tokenHash = hashInvitationToken(token.trim());
    await this.dataSource.transaction(async (manager) => {
      const invitation = await manager.findOne(AccessToken, {
        where: {
          tokenHash,
          purpose: AccessTokenPurpose.INVITATION,
          consumedAt: IsNull(),
        },
      });
      if (
        !invitation ||
        invitation.expiresAt.getTime() <= Date.now() ||
        !invitation.tenantId
      ) {
        throw new BadRequestException(
          'Cette invitation est invalide ou expirée.',
        );
      }
      const membership = await manager.findOne(Membership, {
        where: { tenantId: invitation.tenantId, userId: invitation.userId },
      });
      const user = await manager.findOne(User, {
        where: { id: invitation.userId },
      });
      if (!membership || !user) {
        throw new BadRequestException(
          'Cette invitation ne correspond plus à un compte.',
        );
      }
      await manager.update(User, user.id, {
        passwordHash: await hashPassword(password),
        passwordChangedAt: new Date(),
        isActive: true,
      });
      await manager.update(Membership, membership.id, { isActive: true });
      await manager.update(AccessToken, invitation.id, {
        consumedAt: new Date(),
      });
      await this.audit.record(
        {
          action: 'membership.invitation.accepted',
          entityType: 'membership',
          entityId: membership.id,
          tenantId: invitation.tenantId,
          actorId: user.id,
          newValues: { isActive: true },
        },
        manager,
      );
    });
    return { activated: true };
  }

  async getTenantMember(
    tenantId: string,
    membershipId: string,
  ): Promise<TenantMemberDto> {
    const { membership, user } = await this.requireTenantMember(
      tenantId,
      membershipId,
    );
    return this.toTenantMember(membership, user);
  }

  async updateMemberRole(
    tenantId: string,
    membershipId: string,
    actorId: string,
    dto: UpdateMemberRoleDto,
  ): Promise<TenantMemberDto> {
    if (!ASSIGNABLE_ROLES.includes(dto.role)) {
      throw new ForbiddenException('Ce rôle ne peut pas être attribué');
    }
    return this.dataSource.transaction(async (manager) => {
      const membership = await manager.findOne(Membership, {
        where: { id: membershipId, tenantId },
      });
      if (!membership) throw new NotFoundException('Membre introuvable');
      if (membership.role === MembershipRole.OWNER) {
        throw new ForbiddenException(
          'Le rôle du propriétaire ne peut pas être modifié ici',
        );
      }
      const previousRole = membership.role;
      membership.role = dto.role;
      const saved = await manager.save(membership);
      const user = await manager.findOneByOrFail(User, { id: saved.userId });
      await this.audit.record(
        {
          action: 'membership.role.updated',
          entityType: 'membership',
          entityId: saved.id,
          tenantId,
          actorId,
          reason: dto.reason ?? null,
          oldValues: { role: previousRole },
          newValues: { role: saved.role },
        },
        manager,
      );
      return this.toTenantMember(saved, user);
    });
  }

  async updateMemberStatus(
    tenantId: string,
    membershipId: string,
    actorId: string,
    dto: UpdateMemberStatusDto,
  ): Promise<TenantMemberDto> {
    return this.dataSource.transaction(async (manager) => {
      const membership = await manager.findOne(Membership, {
        where: { id: membershipId, tenantId },
      });
      if (!membership) throw new NotFoundException('Membre introuvable');
      if (membership.role === MembershipRole.OWNER && !dto.isActive) {
        throw new ForbiddenException(
          'Le propriétaire ne peut pas être suspendu depuis cet écran',
        );
      }
      const previous = membership.isActive;
      membership.isActive = dto.isActive;
      const saved = await manager.save(membership);
      if (!dto.isActive) {
        await manager.update(
          AuthSession,
          { userId: saved.userId, revokedAt: IsNull() },
          { revokedAt: new Date() },
        );
      }
      const user = await manager.findOneByOrFail(User, { id: saved.userId });
      await this.audit.record(
        {
          action: dto.isActive
            ? 'membership.activated'
            : 'membership.suspended',
          entityType: 'membership',
          entityId: saved.id,
          tenantId,
          actorId,
          reason: dto.reason ?? null,
          oldValues: { isActive: previous },
          newValues: { isActive: saved.isActive },
        },
        manager,
      );
      return this.toTenantMember(saved, user);
    });
  }

  async resetMemberPassword(
    tenantId: string,
    membershipId: string,
    actorId: string,
    dto: ResetMemberPasswordDto,
  ): Promise<{ updated: true }> {
    return this.dataSource.transaction(async (manager) => {
      const membership = await manager.findOne(Membership, {
        where: { id: membershipId, tenantId },
      });
      if (!membership) throw new NotFoundException('Membre introuvable');
      const passwordHash = await hashPassword(dto.password);
      await manager.update(User, membership.userId, {
        passwordHash,
        passwordChangedAt: new Date(),
      });
      await manager.update(
        AuthSession,
        { userId: membership.userId, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );
      await this.audit.record(
        {
          action: 'membership.password.reset',
          entityType: 'membership',
          entityId: membership.id,
          tenantId,
          actorId,
          reason: dto.reason ?? null,
        },
        manager,
      );
      return { updated: true };
    });
  }

  permissionCatalog() {
    return MEMBER_PERMISSION_CODES.map((code) => ({ code }));
  }

  async listMemberPermissions(tenantId: string, membershipId: string) {
    await this.requireTenantMember(tenantId, membershipId);
    return this.permissions.find({
      where: { tenantId, membershipId },
      order: { permissionCode: 'ASC' },
    });
  }

  async setMemberPermission(
    tenantId: string,
    membershipId: string,
    permissionCode: string,
    actorId: string,
    dto: SetMemberPermissionDto,
  ) {
    if (!MEMBER_PERMISSION_CODES.includes(permissionCode as never)) {
      throw new NotFoundException('Permission inconnue');
    }
    await this.requireTenantMember(tenantId, membershipId);
    return this.dataSource.transaction(async (manager) => {
      let permission = await manager.findOne(MembershipPermission, {
        where: { tenantId, membershipId, permissionCode },
      });
      const oldValues = permission
        ? { allowed: permission.allowed, reason: permission.reason }
        : null;
      permission = manager.create(MembershipPermission, {
        ...(permission ?? {}),
        tenantId,
        membershipId,
        permissionCode,
        allowed: dto.allowed,
        reason: dto.reason,
        grantedBy: actorId,
      });
      const saved = await manager.save(permission);
      await this.audit.record(
        {
          action: 'membership.permission.set',
          entityType: 'membership_permission',
          entityId: saved.id,
          tenantId,
          actorId,
          reason: dto.reason,
          oldValues,
          newValues: { permissionCode, allowed: dto.allowed },
        },
        manager,
      );
      return saved;
    });
  }

  async removeMemberPermission(
    tenantId: string,
    membershipId: string,
    permissionCode: string,
    actorId: string,
  ) {
    await this.requireTenantMember(tenantId, membershipId);
    const permission = await this.permissions.findOne({
      where: { tenantId, membershipId, permissionCode },
    });
    if (!permission) throw new NotFoundException('Dérogation introuvable');
    await this.dataSource.transaction(async (manager) => {
      await manager.remove(permission);
      await this.audit.record(
        {
          action: 'membership.permission.removed',
          entityType: 'membership_permission',
          entityId: permission.id,
          tenantId,
          actorId,
          oldValues: { permissionCode, allowed: permission.allowed },
        },
        manager,
      );
    });
    return { removed: true };
  }

  async listAuthSessionsForUser(userId: string) {
    return this.authSessions.find({
      where: { userId },
      select: {
        id: true,
        clientType: true,
        expiresAt: true,
        lastSeenAt: true,
        revokedAt: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async listMemberSessions(tenantId: string, membershipId: string) {
    const { user } = await this.requireTenantMember(tenantId, membershipId);
    return this.listAuthSessionsForUser(user.id);
  }

  async revokeAuthSessionForUser(
    userId: string,
    sessionId: string,
    actorId: string,
    tenantId?: string,
  ) {
    const session = await this.authSessions.findOne({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Session introuvable');
    session.revokedAt = session.revokedAt ?? new Date();
    await this.authSessions.save(session);
    await this.audit.record({
      action: 'auth.session.revoked',
      entityType: 'auth_session',
      entityId: session.id,
      tenantId: tenantId ?? null,
      actorId,
    });
    return { revoked: true };
  }

  async revokeMemberSession(
    tenantId: string,
    membershipId: string,
    sessionId: string,
    actorId: string,
  ) {
    const { user } = await this.requireTenantMember(tenantId, membershipId);
    return this.revokeAuthSessionForUser(
      user.id,
      sessionId,
      actorId,
      tenantId,
    );
  }

  async getPublicById(id: string): Promise<UserResponseDto> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return mapUserResponse(user);
  }

  async setAvatar(userId: string, avatarKey: string | null): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    user.avatarKey = avatarKey;
    return this.users.save(user);
  }

  private async describeMemberships(
    memberships: Membership[],
  ): Promise<MembershipViewDto[]> {
    if (memberships.length === 0) {
      return [];
    }

    const tenantIds = memberships.map((membership) => membership.tenantId);
    const [tenants, establishments] = await Promise.all([
      this.tenants.find({ where: { id: In(tenantIds) } }),
      this.establishments.find({ where: { tenantId: In(tenantIds) } }),
    ]);

    const tenantsById = new Map(tenants.map((tenant) => [tenant.id, tenant]));
    const establishmentsByTenant = new Map(
      establishments.map((establishment) => [
        establishment.tenantId,
        establishment,
      ]),
    );

    return memberships.map((membership) => {
      const tenant = tenantsById.get(membership.tenantId);
      const establishment = establishmentsByTenant.get(membership.tenantId);

      return {
        tenantId: membership.tenantId,
        tenantName: tenant?.name ?? '',
        currency: tenant?.currency ?? 'CDF',
        role: membership.role,
        establishmentId: establishment?.id ?? null,
        activityType: establishment?.activityType ?? null,
      };
    });
  }

  private async requireTenantMember(tenantId: string, membershipId: string) {
    const membership = await this.memberships.findOne({
      where: { id: membershipId, tenantId },
    });
    if (!membership) throw new NotFoundException('Membre introuvable');
    const user = await this.users.findOne({ where: { id: membership.userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return { membership, user };
  }

  private toTenantMember(membership: Membership, user: User): TenantMemberDto {
    return {
      membershipId: membership.id,
      userId: user.id,
      email: user.email,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      sex: user.sex,
      phone: user.phone,
      avatarKey: user.avatarKey,
      role: membership.role,
      isActive: membership.isActive,
      invitationPending: false,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    };
  }
}

function memberRoleLabel(role: MembershipRole, sex: 'male' | 'female'): string {
  if (role === MembershipRole.CASHIER) {
    return sex === 'female' ? 'caissière' : 'caissier';
  }
  return 'responsable des stocks';
}

function hashInvitationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
