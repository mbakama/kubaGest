import { ApiProperty } from '@nestjs/swagger';

export class DashboardSalesTodayDto {
  @ApiProperty({ example: '245000.000000' })
  amount: string;

  @ApiProperty({
    example: 12,
    nullable: true,
    description:
      'Variation en % par rapport à la veille. Nulle s’il n’y a rien à comparer.',
  })
  changePercent: number | null;

  @ApiProperty({ example: 12 })
  saleCount: number;
}

export class DashboardCashBalanceDto {
  @ApiProperty({ example: '180500.000000' })
  amount: string;

  @ApiProperty({ enum: ['none', 'open', 'closed'] })
  status: 'none' | 'open' | 'closed';

  @ApiProperty({ example: 'À jour', nullable: true })
  badge: string | null;
}

export class DashboardDayDto {
  @ApiProperty({ example: '2026-10-27' })
  date: string;

  @ApiProperty({ example: 'Mar' })
  label: string;

  @ApiProperty({ example: '112.000000' })
  amount: string;
}

export class DashboardSalesTrendDto {
  @ApiProperty({ example: '1240000.000000' })
  amount: string;

  @ApiProperty({ example: 8.4, nullable: true })
  changePercent: number | null;

  @ApiProperty({ type: [DashboardDayDto] })
  days: DashboardDayDto[];
}

export class DashboardActivityDto {
  @ApiProperty({ enum: ['sale', 'stock'] })
  kind: 'sale' | 'stock';

  @ApiProperty({ example: 'Vente Nº 1048' })
  title: string;

  @ApiProperty({ example: 'Il y a 5 min · Espèces' })
  subtitle: string;

  @ApiProperty({ example: '25000.000000', nullable: true })
  amount: string | null;

  @ApiProperty({ example: 'À vérifier', nullable: true })
  label: string | null;

  @ApiProperty({ enum: ['positive', 'warning'] })
  tone: 'positive' | 'warning';
}

export class DashboardResponseDto {
  @ApiProperty({ example: 'CDF' })
  currency: string;

  @ApiProperty({ example: 'Africa/Kinshasa' })
  timezone: string;

  @ApiProperty({ type: String, format: 'date-time' })
  asOf: string;

  @ApiProperty({ type: DashboardSalesTodayDto })
  salesToday: DashboardSalesTodayDto;

  @ApiProperty({ type: DashboardCashBalanceDto })
  cashBalance: DashboardCashBalanceDto;

  @ApiProperty({ type: DashboardSalesTrendDto })
  salesTrend: DashboardSalesTrendDto;

  @ApiProperty({ type: [DashboardActivityDto] })
  recentActivity: DashboardActivityDto[];
}
