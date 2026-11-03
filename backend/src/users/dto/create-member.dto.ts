import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { MembershipRole } from '../membership-role.enum.js';

/** Rôles qu'un propriétaire peut attribuer depuis l'application. */
export const ASSIGNABLE_ROLES: MembershipRole[] = [
  MembershipRole.CASHIER,
  MembershipRole.STOCK_MANAGER,
];

export class CreateMemberDto {
  @ApiProperty({ example: 'caissier@kubagest.io' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'MotDePasse123!', minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiProperty({
    enum: ASSIGNABLE_ROLES,
    example: MembershipRole.CASHIER,
  })
  @IsIn(ASSIGNABLE_ROLES)
  role: MembershipRole;
}
