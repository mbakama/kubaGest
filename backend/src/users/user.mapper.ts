import { ApiProperty } from '@nestjs/swagger';
import { MembershipRole } from './membership-role.enum.js';

export class MembershipViewDto {
  @ApiProperty({ format: 'uuid' })
  tenantId: string;

  @ApiProperty({ example: 'Boutique Kintambo' })
  tenantName: string;

  @ApiProperty({
    example: 'CDF',
    description: 'Devise de référence du tenant (ISO 4217)',
  })
  currency: string;

  @ApiProperty({ enum: MembershipRole, example: MembershipRole.OWNER })
  role: MembershipRole;

  @ApiProperty({ format: 'uuid', nullable: true })
  establishmentId: string | null;

  @ApiProperty({ example: 'boutique', nullable: true })
  activityType: string | null;
}

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'admin@kubagest.io' })
  email: string;

  @ApiProperty({ example: 'Hector', nullable: true })
  firstName: string | null;

  @ApiProperty({ example: 'Kabeya', nullable: true })
  lastName: string | null;

  @ApiProperty({ example: '+243 810 000 000', nullable: true })
  phone: string | null;

  @ApiProperty({ example: 'avatars/profile.webp', nullable: true })
  avatar: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export function mapUserResponse(user: {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatarKey: string | null;
  createdAt: Date;
}): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    avatar: user.avatarKey
      ? `/api/v1/users/${user.id}/avatar?v=${encodeURIComponent(user.avatarKey)}`
      : null,
    createdAt: user.createdAt,
  };
}

export class ProfileResponseDto extends UserResponseDto {
  @ApiProperty({ type: [MembershipViewDto] })
  memberships: MembershipViewDto[];
}
