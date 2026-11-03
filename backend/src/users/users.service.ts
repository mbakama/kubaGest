import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { hashPassword } from '../common/password.js';
import { Establishment } from '../tenants/establishment.entity.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { ASSIGNABLE_ROLES, CreateMemberDto } from './dto/create-member.dto.js';
import { TenantMemberDto } from './dto/tenant-member.dto.js';
import { Membership } from './membership.entity.js';
import {
  MembershipViewDto,
  ProfileResponseDto,
  UserResponseDto,
  mapUserResponse,
} from './user.mapper.js';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Membership)
    private readonly memberships: Repository<Membership>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Establishment)
    private readonly establishments: Repository<Establishment>,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
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
    const usersById = new Map(users.map((user) => [user.id, user]));

    return memberships.flatMap((membership) => {
      const user = usersById.get(membership.userId);
      return user
        ? [
            {
              userId: user.id,
              email: user.email,
              role: membership.role,
              isActive: membership.isActive,
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
  ): Promise<TenantMemberDto> {
    if (!ASSIGNABLE_ROLES.includes(dto.role)) {
      throw new ForbiddenException(
        'Ce rôle ne peut pas être attribué depuis cette route',
      );
    }

    const email = dto.email.trim().toLowerCase();
    const passwordHash = await hashPassword(dto.password);

    return this.dataSource.transaction(async (manager) => {
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
      } else {
        user = await manager.save(
          manager.create(User, {
            email,
            passwordHash,
            isPlatformAdmin: false,
          }),
        );
      }

      await manager.save(
        manager.create(Membership, {
          tenantId,
          userId: user.id,
          role: dto.role,
          isActive: true,
        }),
      );

      await this.audit.record(
        {
          action: 'membership.created',
          entityType: 'membership',
          entityId: `${tenantId}:${user.id}`,
          tenantId,
          actorId,
          newValues: { email, role: dto.role },
        },
        manager,
      );

      return {
        userId: user.id,
        email: user.email,
        role: dto.role,
        isActive: true,
      };
    });
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
}
