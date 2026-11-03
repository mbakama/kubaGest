import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TenantPlan, TenantStatus } from '../tenant.enums.js';

/**
 * Paramétrage d'un abonnement par le super administrateur plateforme (§3).
 * Aucune donnée métier (produits, ventes…) n'est accessible par ces routes.
 */
export class UpdateSubscriptionDto {
  @ApiProperty({ enum: TenantPlan, required: false })
  @IsOptional()
  @IsEnum(TenantPlan)
  plan?: TenantPlan;

  @ApiProperty({ enum: TenantStatus, required: false })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: false,
    nullable: true,
    description: 'Échéance ; null pour retirer l’échéance',
  })
  @IsOptional()
  @IsDateString({}, { message: 'endAt doit être une date ISO 8601' })
  endAt?: string | null;
}
