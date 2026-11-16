import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MembershipRole } from '../membership-role.enum.js';
import { USER_SEXES, type UserSex } from '../user-sex.js';

/** Rôles qu'un propriétaire peut attribuer depuis l'application. */
export const ASSIGNABLE_ROLES: MembershipRole[] = [
  MembershipRole.CASHIER,
  MembershipRole.STOCK_MANAGER,
];

export { USER_SEXES, type UserSex };

export class CreateMemberDto {
  @ApiProperty({ example: 'Nelly' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  firstName: string;

  @ApiProperty({ example: 'Kalonji' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  lastName: string;

  @ApiProperty({ enum: USER_SEXES, example: 'female' })
  @IsIn(USER_SEXES)
  sex: UserSex;

  @ApiProperty({ example: '+243810000000', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ example: 'caissier@kubagest.io' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    enum: ASSIGNABLE_ROLES,
    example: MembershipRole.CASHIER,
  })
  @IsIn(ASSIGNABLE_ROLES)
  role: MembershipRole;
}
