import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditService } from '../../audit/audit.service.js';
import {
  formatTelephoneWithCountryCode,
  isValidRdcPhone,
} from '../../common/rdc-phone.js';
import { mapUserResponse } from '../../users/user.mapper.js';
import { User } from '../../users/user.entity.js';
import type { PlatformAdminProfileResponseDto } from '../dto/platform-admin-profile-response.dto.js';
import type { UpdatePlatformAdminProfileDto } from '../dto/update-platform-admin-profile.dto.js';
import { PlatformDashboardService } from '../platform-dashboard/platform-dashboard.service.js';

const PLATFORM_ADMIN_ROLE_LABEL = 'Super Administrateur';
const DEFAULT_ORGANIZATION = 'KubaGest';

function buildFullName(user: User): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.email.split('@')[0] || user.email;
}

function buildDisplayId(adminsOrderedByJoin: User[], userId: string): string {
  const index = adminsOrderedByJoin.findIndex((row) => row.id === userId);
  const rank = index >= 0 ? index + 1 : 1;
  return `ADM-${String(rank).padStart(4, '0')}`;
}

@Injectable()
export class PlatformProfileService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly dashboard: PlatformDashboardService,
    private readonly audit: AuditService,
  ) {}

  async getAdminProfile(userId: string): Promise<PlatformAdminProfileResponseDto> {
    const user = await this.users.findOne({
      where: { id: userId, isPlatformAdmin: true },
    });

    if (!user) {
      throw new NotFoundException('Profil administrateur introuvable');
    }

    const [platformAdmins, dashboard] = await Promise.all([
      this.users.find({
        where: { isPlatformAdmin: true },
        order: { createdAt: 'ASC' },
        select: { id: true, createdAt: true },
      }),
      this.dashboard.getDashboard(),
    ]);

    const fullName = buildFullName(user);

    return {
      user: mapUserResponse(user),
      identity: {
        displayId: buildDisplayId(platformAdmins, user.id),
        roleLabel: PLATFORM_ADMIN_ROLE_LABEL,
        status: user.isActive ? 'active' : 'inactive',
        memberSince: user.createdAt,
        managedSpacesCount: dashboard.kpis.tenantCount,
      },
      personal: {
        fullName,
        roleLabel: PLATFORM_ADMIN_ROLE_LABEL,
        email: user.email,
        organization: DEFAULT_ORGANIZATION,
        phone: user.phone,
        location: null,
      },
      accountSummary: dashboard.kpis,
      security: {
        passwordLastChangedAt: user.passwordChangedAt,
        twoFactor: { available: false, enabled: false },
        recoveryEmail: user.email,
      },
    };
  }

  async updateAdminProfile(
    userId: string,
    dto: UpdatePlatformAdminProfileDto,
  ): Promise<PlatformAdminProfileResponseDto> {
    const hasField =
      dto.firstName !== undefined ||
      dto.lastName !== undefined ||
      dto.phone !== undefined;

    if (!hasField) {
      throw new BadRequestException('Aucune information à mettre à jour');
    }

    const user = await this.users.findOne({
      where: { id: userId, isPlatformAdmin: true },
    });

    if (!user) {
      throw new NotFoundException('Profil administrateur introuvable');
    }

    const oldValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    if (dto.firstName !== undefined) {
      oldValues.firstName = user.firstName;
      newValues.firstName = dto.firstName;
      user.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      oldValues.lastName = user.lastName;
      newValues.lastName = dto.lastName;
      user.lastName = dto.lastName;
    }
    if (dto.phone !== undefined) {
      oldValues.phone = user.phone;
      if (dto.phone === null || dto.phone === '') {
        newValues.phone = null;
        user.phone = null;
      } else {
        const normalized = formatTelephoneWithCountryCode(dto.phone);
        if (!normalized || !isValidRdcPhone(normalized)) {
          throw new BadRequestException(
            'Numéro de téléphone invalide (format RDC attendu).',
          );
        }
        newValues.phone = normalized;
        user.phone = normalized;
      }
    }

    await this.users.save(user);

    await this.audit.record({
      action: 'platform_admin.profile.updated',
      entityType: 'user',
      entityId: user.id,
      actorId: userId,
      oldValues,
      newValues,
    });

    return this.getAdminProfile(userId);
  }
}
