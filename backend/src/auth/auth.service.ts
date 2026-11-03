import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { hashPassword, verifyPassword } from '../common/password.js';
import { Establishment } from '../tenants/establishment.entity.js';
import { Plan } from '../tenants/plan.entity.js';
import { assertTenantUsable } from '../tenants/tenant-access.js';
import { computeTrialEnd } from '../tenants/tenant.constants.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { TenantPlan, TenantStatus } from '../tenants/tenant.enums.js';
import { Subscription } from '../tenants/subscription.entity.js';
import { Membership } from '../users/membership.entity.js';
import { MembershipRole } from '../users/membership-role.enum.js';
import { mapUserResponse, ProfileResponseDto } from '../users/user.mapper.js';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthContextDto, AuthResponseDto } from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { JwtPayload } from './jwt-payload.interface.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  /**
   * Inscription = activation d'un établissement (§4) : le tenant, son
   * établissement, le compte propriétaire et son rattachement sont créés dans
   * une seule transaction.
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();

    if (await this.users.findByEmail(email)) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    const passwordHash = await hashPassword(dto.password);

    const { user, tenant, establishment, membership } =
      await this.dataSource.transaction(async (manager) => {
        const tenant = await manager.save(
          manager.create(Tenant, {
            name: dto.tenantName.trim(),
            status: TenantStatus.TRIAL,
            // F01 : devise de référence et adresse facultative.
            currency: dto.currency ?? 'CDF',
            address: dto.address?.trim() || null,
          }),
        );

        // Le prix et la formule vivent dans l'abonnement, pas sur le tenant
        // (dictionnaire §3).
        const plan = await manager.findOne(Plan, {
          where: { code: TenantPlan.ESSENTIAL },
        });

        if (!plan) {
          throw new InternalServerErrorException(
            'Formule de référence absente ; vérifiez l’initialisation des plans',
          );
        }

        // F07 : l'abonnement d'essai suit le tenant dès l'activation, avec
        // une échéance à 30 jours.
        await manager.save(
          manager.create(Subscription, {
            tenantId: tenant.id,
            planId: plan.id,
            status: tenant.status,
            currency: tenant.currency,
            endsAt: computeTrialEnd(),
          }),
        );

        const establishment = await manager.save(
          manager.create(Establishment, {
            tenantId: tenant.id,
            name: dto.tenantName.trim(),
            activityType: dto.activityType,
          }),
        );

        const user = await manager.save(
          manager.create(User, {
            email,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            phone: dto.phone?.trim() || null,
            passwordHash,
            isPlatformAdmin: false,
          }),
        );

        const membership = await manager.save(
          manager.create(Membership, {
            tenantId: tenant.id,
            userId: user.id,
            role: MembershipRole.OWNER,
            isActive: true,
          }),
        );

        await this.audit.record(
          {
            action: 'tenant.registered',
            entityType: 'tenant',
            entityId: tenant.id,
            tenantId: tenant.id,
            actorId: user.id,
            newValues: {
              name: tenant.name,
              activityType: establishment.activityType,
              email,
            },
          },
          manager,
        );

        return { user, tenant, establishment, membership };
      });

    const context: AuthContextDto = {
      tenantId: tenant.id,
      tenantName: tenant.name,
      currency: tenant.currency,
      establishmentId: establishment.id,
      activityType: establishment.activityType,
      role: membership.role,
    };

    return {
      accessToken: await this.signToken({
        sub: user.id,
        email: user.email,
        tenantId: tenant.id,
        establishmentId: establishment.id,
        role: membership.role,
        isPlatformAdmin: false,
      }),
      user: mapUserResponse(user),
      context,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);

    if (!user || !(await verifyPassword(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Jeton plateforme explicite : le super administrateur n'obtient aucun
    // contexte tenant, donc aucun accès métier implicite (§3).
    if (dto.platform) {
      if (!user.isPlatformAdmin) {
        throw new ForbiddenException(
          'Action réservée au super administrateur plateforme',
        );
      }

      return {
        accessToken: await this.signToken({
          sub: user.id,
          email: user.email,
          isPlatformAdmin: true,
        }),
        user: mapUserResponse(user),
        context: null,
      };
    }

    const membership = await this.users.findMembership(user.id, dto.tenantId);

    if (!membership) {
      // Un administrateur plateforme n'a aucun accès métier implicite (§3).
      if (user.isPlatformAdmin && !dto.tenantId) {
        return {
          accessToken: await this.signToken({
            sub: user.id,
            email: user.email,
            isPlatformAdmin: true,
          }),
          user: mapUserResponse(user),
          context: null,
        };
      }

      throw new ForbiddenException(
        dto.tenantId
          ? "Vous n'avez pas accès à cet établissement"
          : "Aucun établissement actif n'est rattaché à ce compte",
      );
    }

    const view = await this.users.describeMembership(membership);

    // F07 : un établissement suspendu ne peut plus se connecter.
    assertTenantUsable(
      await this.dataSource
        .getRepository(Tenant)
        .findOne({ where: { id: membership.tenantId } }),
    );

    return {
      accessToken: await this.signToken({
        sub: user.id,
        email: user.email,
        tenantId: membership.tenantId,
        establishmentId: view.establishmentId ?? undefined,
        role: membership.role,
        isPlatformAdmin: user.isPlatformAdmin,
      }),
      user: mapUserResponse(user),
      context: {
        tenantId: view.tenantId,
        tenantName: view.tenantName,
        currency: view.currency ?? 'CDF',
        establishmentId: view.establishmentId,
        activityType: view.activityType ?? '',
        role: view.role,
      },
    };
  }

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Compte introuvable');
    }

    return this.users.buildProfile(user);
  }

  private signToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
