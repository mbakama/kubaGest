import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@kubagest.io' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'MotDePasse123!' })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password: string;

  @ApiProperty({
    format: 'uuid',
    required: false,
    description:
      'Tenant à activer lorsque le compte appartient à plusieurs établissements',
  })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiProperty({
    required: false,
    description:
      'Demander un jeton plateforme (super administrateur, sans contexte tenant)',
  })
  @IsOptional()
  @IsBoolean()
  platform?: boolean;
}
