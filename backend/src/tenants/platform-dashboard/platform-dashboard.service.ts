import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditPlatformReadService } from '../../audit/audit-platform-read.service.js';
import { User } from '../../users/user.entity.js';
import type { PlatformDashboardResponseDto } from '../dto/platform-dashboard-response.dto.js';
import type { PlatformTenantResponseDto } from '../dto/tenant-response.dto.js';
import { TenantStatus } from '../../core/tenants/tenant.enums.js';
import { TenantsService } from '../tenants/tenants.service.js';
import { Tenant } from '../entities/tenant.entity.js';

const DASHBOARD_MONTHS = 11;
const RECENT_TENANTS = 5;
const RECENT_ACTIVITY = 10;

@Injectable()
export class PlatformDashboardService {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly auditPlatform: AuditPlatformReadService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
  ) {}

  async getDashboard(now = new Date()): Promise<PlatformDashboardResponseDto> {
    const [userCount, platformTenants] = await Promise.all([
      this.users.count({
        where: { isActive: true, isPlatformAdmin: false },
      }),
      this.tenantsService.listForPlatform({}),
    ]);

    const activeSubscriptions = platformTenants.filter((tenant) => {
      const status = tenant.subscription?.status;
      return status === TenantStatus.ACTIVE || status === TenantStatus.TRIAL;
    }).length;

    const planDistribution = this.buildPlanDistribution(platformTenants);
    const creationsByMonth = this.buildCreationsByMonth(platformTenants, now);
    const recentTenants = [...platformTenants]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, RECENT_TENANTS);

    const recentActivity = await this.auditPlatform.listRecentForDashboard(RECENT_ACTIVITY);

    return {
      generatedAt: now,
      kpis: {
        userCount,
        tenantCount: platformTenants.length,
        activeSubscriptions,
        monthlyRevenue: { available: false },
      },
      planDistribution,
      creationsByMonth,
      recentTenants,
      recentActivity,
    };
  }

  private buildPlanDistribution(
    tenants: PlatformTenantResponseDto[],
  ): { plan: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const tenant of tenants) {
      const plan = tenant.subscription?.plan ?? 'unknown';
      counts.set(plan, (counts.get(plan) ?? 0) + 1);
    }
    if (counts.size === 0) {
      return [];
    }
    return [...counts.entries()]
      .map(([plan, count]) => ({ plan, count }))
      .sort((a, b) => b.count - a.count);
  }

  private buildCreationsByMonth(
    tenants: PlatformTenantResponseDto[],
    now: Date,
  ): { period: string; count: number }[] {
    const months: { period: string; count: number }[] = [];
    for (let offset = DASHBOARD_MONTHS - 1; offset >= 0; offset -= 1) {
      const anchor = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1),
      );
      const period = `${anchor.getUTCFullYear()}-${String(anchor.getUTCMonth() + 1).padStart(2, '0')}`;
      const count = tenants.filter((tenant) => {
        const created = tenant.createdAt;
        return (
          created.getUTCFullYear() === anchor.getUTCFullYear() &&
          created.getUTCMonth() === anchor.getUTCMonth()
        );
      }).length;
      months.push({ period, count });
    }
    return months;
  }
}