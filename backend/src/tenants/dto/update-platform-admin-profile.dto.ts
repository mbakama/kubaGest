import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

function trimOptional(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function emptyPhoneToNull(value: unknown): unknown {
  if (value === '' || value === undefined) {
    return null;
  }
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdatePlatformAdminProfileDto {
  @ApiPropertyOptional({ example: 'Hector', maxLength: 80 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @Transform(({ value }) => trimOptional(value))
  firstName?: string;

  @ApiPropertyOptional({ example: 'Mbakama', maxLength: 80 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @Transform(({ value }) => trimOptional(value))
  lastName?: string;

  @ApiPropertyOptional({
    example: '+243812345678',
    maxLength: 30,
    nullable: true,
    description: 'Chaîne vide pour effacer le numéro',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => emptyPhoneToNull(value))
  phone?: string | null;
}
