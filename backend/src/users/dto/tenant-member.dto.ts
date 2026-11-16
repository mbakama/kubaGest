import { ApiProperty } from '@nestjs/swagger';
import { MembershipRole } from '../membership-role.enum.js';

export class TenantMemberDto {
  @ApiProperty({ format: 'uuid' })
  membershipId: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ example: 'caissier@kubagest.io' })
  email: string;

  @ApiProperty({ example: 'Nelly' })
  firstName: string;

  @ApiProperty({ example: 'Kalonji' })
  lastName: string;

  @ApiProperty({ enum: ['male', 'female'], nullable: true })
  sex: 'male' | 'female' | null;

  @ApiProperty({ example: '+243810000000', nullable: true })
  phone: string | null;

  @ApiProperty({ nullable: true })
  avatarKey: string | null;

  @ApiProperty({ enum: MembershipRole, example: MembershipRole.CASHIER })
  role: MembershipRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  invitationPending: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
