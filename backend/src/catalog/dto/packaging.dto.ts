import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { MONEY_PATTERN, normalizeDecimal } from '../../common/decimal.js';

export class CreatePackagingDto {
  @ApiProperty({ example: 'Boîte de 30', maxLength: 60 })
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  label: string;

  @ApiProperty({
    example: 30,
    description: 'Nombre d’unités de base contenues (entier > 0)',
  })
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  factorToBase: number;

  @ApiProperty({ example: '45000.000000' })
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY_PATTERN, {
    message: 'salePrice doit être un montant décimal positif (6 décimales max)',
  })
  salePrice: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePackagingDto {
  @ApiProperty({ required: false, maxLength: 60 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  label?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  factorToBase?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY_PATTERN, {
    message: 'salePrice doit être un montant décimal positif (6 décimales max)',
  })
  salePrice?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    required: false,
    description:
      'Promouvoir ce conditionnement en base (facteur 1) ; l’ancienne base est rétrogradée',
  })
  @IsOptional()
  @IsBoolean()
  isBase?: boolean;
}
