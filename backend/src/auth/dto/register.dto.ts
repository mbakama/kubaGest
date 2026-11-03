import { ApiProperty } from '@nestjs/swagger';
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
import { ActivityType } from '../../tenants/activity-type.enum.js';
import {
  CURRENCY_PATTERN,
  normalizeCurrency,
} from '../../tenants/dto/update-tenant.dto.js';

export class RegisterDto {
  @ApiProperty({ example: 'Hector', maxLength: 80 })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName: string;

  @ApiProperty({ example: 'Kabeya', maxLength: 80 })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName: string;

  @ApiProperty({ example: '+243 810 000 000', maxLength: 30, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ example: 'Boutique Kintambo', maxLength: 150 })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  tenantName: string;

  @ApiProperty({
    enum: ActivityType,
    example: ActivityType.BOUTIQUE,
    description: "Type d'établissement, fixé à l'activation",
  })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiProperty({
    example: 'CDF',
    required: false,
    description: 'Devise de référence (ISO 4217), CDF par défaut',
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
    description: 'Adresse facultative (F01)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({ example: 'admin@kubagest.io' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'MotDePasse123!', minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
