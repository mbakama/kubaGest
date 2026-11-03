import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/user.mapper.js';
import { MembershipRole } from '../../users/membership-role.enum.js';

export class AuthContextDto {
  @ApiProperty({ format: 'uuid' })
  tenantId: string;

  @ApiProperty({ example: 'Boutique Kintambo' })
  tenantName: string;

  @ApiProperty({
    example: 'CDF',
    description: 'Devise de référence du tenant (ISO 4217)',
  })
  currency: string;

  @ApiProperty({ format: 'uuid', nullable: true })
  establishmentId: string | null;

  @ApiProperty({ example: 'boutique' })
  activityType: string;

  @ApiProperty({ enum: MembershipRole, example: MembershipRole.OWNER })
  role: MembershipRole;
}

export class AuthResponseDto {
  @ApiProperty({
    description: "Jeton JWT à envoyer dans l'en-tête Authorization",
  })
  accessToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({
    type: AuthContextDto,
    nullable: true,
    description:
      'Contexte actif ; null pour un super administrateur plateforme sans établissement',
  })
  context: AuthContextDto | null;
}
