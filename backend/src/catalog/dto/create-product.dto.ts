import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDefined,
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
  ValidateNested,
} from 'class-validator';
import { normalizeDecimal, TAX_RATE_PATTERN } from '../../common/decimal.js';
import { AllocationPolicy, TrackingMode } from '../catalog.enums.js';

export class DrugDetailsInputDto {
  @ApiProperty({ example: 'Paracétamol' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  activeIngredient: string;

  @ApiProperty({ example: '500 mg' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  strength: string;

  @ApiProperty({ example: 'Comprimé' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  dosageForm: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  prescriptionRequired?: boolean;
}

/** Conditionnement de base créé avec l'article (prix de vente unitaire). */
export class BasePackagingInputDto {
  @ApiProperty({ example: 'Pièce', maxLength: 60 })
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  label: string;

  @ApiProperty({ example: '1500.000000' })
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(/^\d{1,14}(\.\d{1,6})?$/, {
    message: 'salePrice doit être un montant décimal positif (6 décimales max)',
  })
  salePrice: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'PARA-500', maxLength: 80 })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  sku: string;

  @ApiProperty({ example: 'Paracétamol 500 mg', maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'comprimé', maxLength: 30 })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  baseUnit: string;

  @ApiProperty({ required: false, format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ required: false, example: 10, description: 'Seuil d’alerte' })
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

  @ApiProperty({ required: false, example: '0', description: 'Taxe en %' })
  @IsOptional()
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(TAX_RATE_PATTERN, {
    message: 'taxRate doit être un pourcentage (4 décimales max)',
  })
  taxRate?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: BasePackagingInputDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => BasePackagingInputDto)
  basePackaging: BasePackagingInputDto;

  @ApiProperty({ type: DrugDetailsInputDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DrugDetailsInputDto)
  drugDetails?: DrugDetailsInputDto;

  @ApiProperty({
    type: [String],
    required: false,
    example: ['0123456789012'],
    maxItems: 20,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  barcodes?: string[];
}
