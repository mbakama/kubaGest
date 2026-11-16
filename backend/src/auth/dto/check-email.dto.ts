import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';

export class CheckEmailDto {
  @ApiProperty({ example: 'proprietaire@kubagest.io' })
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;
}

export class CheckEmailResponseDto {
  @ApiProperty({
    description: 'false si un compte utilise déjà cette adresse',
    example: true,
  })
  available: boolean;
}
