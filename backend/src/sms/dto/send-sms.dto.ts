import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { E164_PATTERN } from '../../common/phone.js';

export class SendSmsDto {
  @ApiProperty({
    example: '+243810000001',
    description:
      'Destinataire au format international. Sur un compte d’essai Twilio, ce numéro doit être vérifié dans la console.',
  })
  @Matches(E164_PATTERN, {
    message: 'to doit être au format international, par exemple +243810000001',
  })
  to: string;

  @ApiProperty({
    example: 'Essai Kubagest',
    minLength: 1,
    maxLength: 320,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  body: string;
}

export class SmsReceiptDto {
  @ApiProperty({ example: 'SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' })
  sid: string;

  @ApiProperty({ example: 'queued' })
  status: string;

  @ApiProperty({ example: '+243810000001' })
  to: string;
}
