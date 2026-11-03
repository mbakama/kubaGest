import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TenantPlan, TenantStatus } from '../tenant.enums.js';

export class ListTenantsQueryDto {
  @ApiProperty({ enum: TenantStatus, required: false })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiProperty({ enum: TenantPlan, required: false })
  @IsOptional()
  @IsEnum(TenantPlan)
  plan?: TenantPlan;
}
