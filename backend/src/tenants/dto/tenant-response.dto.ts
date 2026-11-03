import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '../activity-type.enum.js';
import { TenantStatus } from '../tenant.enums.js';

export class SubscriptionResponseDto {
  @ApiProperty({ example: 'essential', description: 'Code de la formule' })
  plan: string;

  @ApiProperty({ enum: TenantStatus, example: TenantStatus.TRIAL })
  status: TenantStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  startAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: "Échéance de l'abonnement, nulle si non contractée",
  })
  endAt: Date | null;
}

export class EstablishmentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Boutique Kintambo' })
  name: string;

  @ApiProperty({ enum: ActivityType, example: ActivityType.BOUTIQUE })
  activityType: ActivityType;

  @ApiProperty({ example: 'Africa/Kinshasa' })
  timezone: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class TenantResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Boutique Kintambo' })
  name: string;

  @ApiProperty({
    example: 'CDF',
    description: 'Devise de référence (ISO 4217)',
  })
  currency: string;

  @ApiProperty({ example: '12, avenue de la Libération', nullable: true })
  address: string | null;

  @ApiProperty({ enum: TenantStatus })
  status: TenantStatus;

  @ApiProperty({
    example: 'essential',
    nullable: true,
    description: 'Code de la formule en cours ; null si aucun abonnement',
  })
  plan: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class TenantDetailResponseDto extends TenantResponseDto {
  @ApiProperty({ type: [EstablishmentResponseDto] })
  establishments: EstablishmentResponseDto[];

  @ApiProperty({
    type: SubscriptionResponseDto,
    nullable: true,
    description: 'Abonnement courant ; null si aucun abonnement enregistré',
  })
  subscription: SubscriptionResponseDto | null;
}

export class PlatformTenantResponseDto extends TenantResponseDto {
  @ApiProperty({ type: SubscriptionResponseDto, nullable: true })
  subscription: SubscriptionResponseDto | null;
}
