import { ApiProperty } from '@nestjs/swagger';
import { MembershipRole } from '../membership-role.enum.js';

export class TenantMemberDto {
  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ example: 'caissier@kubagest.io' })
  email: string;

  @ApiProperty({ enum: MembershipRole, example: MembershipRole.CASHIER })
  role: MembershipRole;

  @ApiProperty({ example: true })
  isActive: boolean;
}
