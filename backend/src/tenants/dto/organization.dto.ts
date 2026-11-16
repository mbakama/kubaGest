import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ActivityType } from '../../core/tenants/activity-type.enum.js';

const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{1,39}$/;

function normalizeCode(value: unknown): unknown {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

export class CreateEstablishmentDto {
  @ApiProperty({ example: 'GOMBE' })
  @Transform(({ value }) => normalizeCode(value))
  @Matches(CODE_PATTERN)
  code: string;

  @ApiProperty({ example: 'Boutique Gombe' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiPropertyOptional({ example: 'Boulevard du 30 Juin' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+243810000000' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'gombe@kubagest.cd' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Africa/Kinshasa' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  timezone?: string;
}

export class CreateWarehouseDto {
  @ApiProperty({ example: 'GOMBE-RESERVE' })
  @Transform(({ value }) => normalizeCode(value))
  @Matches(CODE_PATTERN)
  code: string;

  @ApiProperty({ example: 'Réserve Gombe' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;
}
