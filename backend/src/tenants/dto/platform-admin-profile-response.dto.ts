import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/user.mapper.js';
import { PlatformDashboardKpisDto } from './platform-dashboard-response.dto.js';

export class PlatformAdminTwoFactorDto {
  @ApiProperty({
    description: 'Faux tant que la 2FA n’est pas implémentée côté produit',
  })
  available: boolean;

  @ApiProperty()
  enabled: boolean;
}

export class PlatformAdminSecurityDto {
  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: 'Dernier changement de mot de passe',
  })
  passwordLastChangedAt: Date | null;

  @ApiProperty({ type: PlatformAdminTwoFactorDto })
  twoFactor: PlatformAdminTwoFactorDto;

  @ApiProperty({
    example: 'admin@kubagest.io',
    description: 'Adresse utilisée pour la récupération de compte',
  })
  recoveryEmail: string;
}

export class PlatformAdminIdentityDto {
  @ApiProperty({ example: 'ADM-0001', description: 'Identifiant affiché' })
  displayId: string;

  @ApiProperty({ example: 'Super Administrateur' })
  roleLabel: string;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  status: 'active' | 'inactive';

  @ApiProperty({ type: String, format: 'date-time' })
  memberSince: Date;

  @ApiProperty({ description: 'Nombre d’espaces (tenants) sur la plateforme' })
  managedSpacesCount: number;
}

export class PlatformAdminPersonalDto {
  @ApiProperty({ example: 'Hector Mbakama' })
  fullName: string;

  @ApiProperty({ example: 'Super Administrateur' })
  roleLabel: string;

  @ApiProperty({ example: 'hector@kubagest.dev' })
  email: string;

  @ApiProperty({ example: 'KubaGest' })
  organization: string;

  @ApiProperty({ example: '+243812345678', nullable: true })
  phone: string | null;

  @ApiProperty({
    example: 'Kinshasa, RDC',
    nullable: true,
    description: 'Non stocké en base pour l’instant',
  })
  location: string | null;
}

export class PlatformAdminProfileResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: PlatformAdminIdentityDto })
  identity: PlatformAdminIdentityDto;

  @ApiProperty({ type: PlatformAdminPersonalDto })
  personal: PlatformAdminPersonalDto;

  @ApiProperty({
    type: PlatformDashboardKpisDto,
    description: 'Indicateurs plateforme (résumé du compte admin)',
  })
  accountSummary: PlatformDashboardKpisDto;

  @ApiProperty({ type: PlatformAdminSecurityDto })
  security: PlatformAdminSecurityDto;
}
