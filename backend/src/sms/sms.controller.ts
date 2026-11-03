import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../auth/guards/platform-admin.guard.js';
import { SendSmsDto, SmsReceiptDto } from './dto/send-sms.dto.js';
import { SmsService } from './sms.service.js';

@ApiTags('sms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PlatformAdminGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly sms: SmsService) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Envoyer un SMS d’essai (super administrateur)',
    description:
      'Passe par le service de messagerie Twilio. Sur un compte d’essai, le destinataire doit être un numéro vérifié dans la console, et le texte peut être préfixé par Twilio.',
  })
  @ApiResponse({ status: 200, type: SmsReceiptDto })
  @ApiResponse({
    status: 400,
    description: 'Numéro ou message refusé par Twilio',
  })
  @ApiResponse({ status: 401, description: 'Jeton invalide ou manquant' })
  @ApiResponse({ status: 403, description: 'Super administrateur requis' })
  @ApiResponse({ status: 503, description: 'Twilio non configuré' })
  sendTest(@Body() dto: SendSmsDto): Promise<SmsReceiptDto> {
    return this.sms.send(dto);
  }
}
