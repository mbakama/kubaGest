import { ApiProperty } from '@nestjs/swagger';
import { PlatformTenantResponseDto } from './tenant-response.dto.js';

export class PlatformDashboardRevenueDto {
  @ApiProperty({
    description: 'Faux tant que la facturation plateforme n’est pas branchée',
  })
  available: boolean;

  @ApiProperty({ required: false, example: '0.00' })
  amount?: string;

  @ApiProperty({ required: false, example: 'USD' })
  currency?: string;
}

export class PlatformDashboardKpisDto {
  @ApiProperty({ description: 'Comptes actifs hors super administrateurs' })
  userCount: number;

  @ApiProperty({ description: 'Nombre d’espaces (tenants)' })
  tenantCount: number;

  @ApiProperty({
    description:
      'Abonnements courants en essai ou actifs (statut de l’abonnement)',
  })
  activeSubscriptions: number;

  @ApiProperty({
    type: PlatformDashboardRevenueDto,
    nullable: true,
    description: 'Revenus du mois calendaire en cours',
  })
  monthlyRevenue: PlatformDashboardRevenueDto | null;
}

export class PlatformDashboardPlanSliceDto {
  @ApiProperty({ example: 'essential' })
  plan: string;

  @ApiProperty()
  count: number;
}

export class PlatformDashboardMonthCountDto {
  @ApiProperty({
    example: '2026-03',
    description: 'Mois calendaire (UTC) au format YYYY-MM',
  })
  period: string;

  @ApiProperty()
  count: number;
}

export class PlatformDashboardActivityDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'tenant.registered' })
  kind: string;

  @ApiProperty({ example: 'Nouvel espace créé' })
  title: string;

  @ApiProperty({ example: 'Boutique Kintambo' })
  detail: string;

  @ApiProperty({ nullable: true, example: 'Hector Mbakama' })
  actorName: string | null;

  @ApiProperty({ nullable: true, example: 'hector@example.com' })
  actorEmail: string | null;

  @ApiProperty({ nullable: true, format: 'uuid' })
  tenantId: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  occurredAt: Date;
}

export class PlatformDashboardResponseDto {
  @ApiProperty({ type: String, format: 'date-time' })
  generatedAt: Date;

  @ApiProperty({ type: PlatformDashboardKpisDto })
  kpis: PlatformDashboardKpisDto;

  @ApiProperty({ type: [PlatformDashboardPlanSliceDto] })
  planDistribution: PlatformDashboardPlanSliceDto[];

  @ApiProperty({ type: [PlatformDashboardMonthCountDto] })
  creationsByMonth: PlatformDashboardMonthCountDto[];

  @ApiProperty({ type: [PlatformTenantResponseDto] })
  recentTenants: PlatformTenantResponseDto[];

  @ApiProperty({ type: [PlatformDashboardActivityDto] })
  recentActivity: PlatformDashboardActivityDto[];
}
