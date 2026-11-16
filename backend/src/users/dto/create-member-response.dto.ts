import { ApiProperty } from '@nestjs/swagger';
import { TenantMemberDto } from './tenant-member.dto.js';

export class CreateMemberResponseDto extends TenantMemberDto {
  @ApiProperty({
    description: 'Indique si l’email d’invitation a été accepté par le serveur SMTP',
    example: true,
  })
  invitationEmailSent: boolean;

  @ApiProperty({
    description:
      'Lien d’activation à transmettre manuellement si l’email n’est pas parti',
    example: 'https://app.kubagest.io/invitation?token=abc',
  })
  invitationUrl: string;
}
