import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Devise ISO 4217 : trois lettres majuscules, ex. CDF ou USD. */
export const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export function normalizeCurrency(value: unknown): unknown {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

export class UpdateTenantDto {
  @ApiProperty({
    example: 'Boutique Kintambo',
    maxLength: 150,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @ApiProperty({
    example: 'CDF',
    required: false,
    description: 'Devise de référence (ISO 4217)',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeCurrency(value))
  @Matches(CURRENCY_PATTERN, {
    message: 'currency doit être un code ISO 4217 à trois lettres',
  })
  currency?: string;

  @ApiProperty({
    example: '12, avenue de la Libération',
    maxLength: 255,
    required: false,
    description: 'Adresse facultative ; chaîne vide pour l’effacer',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
