import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { normalizeDecimal, TAX_RATE_PATTERN } from '../../common/decimal.js';
import { AllocationPolicy, TrackingMode } from '../catalog.enums.js';

export class UpdateProductDto {
  @ApiProperty({ required: false, maxLength: 80 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  sku?: string;

  @ApiProperty({ required: false, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiProperty({
    required: false,
    maxLength: 30,
    description: 'Immuable dès qu’un mouvement de stock existe',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  baseUnit?: string;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  reorderLevel?: number;

  @ApiProperty({ enum: TrackingMode, required: false })
  @IsOptional()
  @IsEnum(TrackingMode)
  trackingMode?: TrackingMode;

  @ApiProperty({ enum: AllocationPolicy, required: false })
  @IsOptional()
  @IsEnum(AllocationPolicy)
  allocationPolicy?: AllocationPolicy;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(TAX_RATE_PATTERN, {
    message: 'taxRate doit être un pourcentage (4 décimales max)',
  })
  taxRate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
