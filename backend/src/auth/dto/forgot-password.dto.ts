import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'proprietaire@kubagest.io' })
  @IsEmail()
  @MaxLength(255)
  email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({ example: true })
  sent: boolean;
}

export class VerifyResetCodeDto {
  @ApiProperty({ example: 'proprietaire@kubagest.io' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '123456' })
  @Matches(/^\d{6}$/, { message: 'Le code comporte 6 chiffres.' })
  code: string;
}

export class VerifyResetCodeResponseDto {
  @ApiProperty()
  resetToken: string;
}

export class ConfirmResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(200)
  resetToken: string;

  @ApiProperty({
    example: 'NouveauMotDePasse123!',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}

export class ConfirmResetPasswordResponseDto {
  @ApiProperty({ example: true })
  updated: boolean;
}
