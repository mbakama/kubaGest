import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../config/env.validation.js';

export type SmsReceipt = {
  sid: string;
  status: string;
  to: string;
};

type TwilioMessage = {
  sid?: string;
  status?: string;
  to?: string;
  message?: string;
};

/**
 * Envoie un SMS via l'API REST Twilio. Les identifiants sont lus depuis
 * l'environnement. L'expéditeur est le service de messagerie Twilio lorsqu'il
 * est configuré, sinon un numéro. Sans compte, jeton et expéditeur, l'appel
 * échoue explicitement et le reste de l'API continue de fonctionner.
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly config: ConfigService<Environment, true>) {}

  /** Vrai lorsque les identifiants nécessaires à l'envoi sont présents. */
  isConfigured(): boolean {
    const accountSid = this.config.get('TWILIO_ACCOUNT_SID', { infer: true });
    const authToken = this.config.get('TWILIO_AUTH_TOKEN', { infer: true });
    const messagingServiceSid = this.config.get(
      'TWILIO_MESSAGING_SERVICE_SID',
      { infer: true },
    );
    const from = this.config.get('TWILIO_FROM_NUMBER', { infer: true });
    return Boolean(accountSid && authToken && (messagingServiceSid || from));
  }

  async send(input: { to: string; body: string }): Promise<SmsReceipt> {
    const accountSid = this.config.get('TWILIO_ACCOUNT_SID', { infer: true });
    const authToken = this.config.get('TWILIO_AUTH_TOKEN', { infer: true });
    const messagingServiceSid = this.config.get(
      'TWILIO_MESSAGING_SERVICE_SID',
      { infer: true },
    );
    const from = this.config.get('TWILIO_FROM_NUMBER', { infer: true });

    if (!accountSid || !authToken || (!messagingServiceSid && !from)) {
      throw new ServiceUnavailableException(
        "L'envoi de SMS n'est pas configuré",
      );
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const authorization = Buffer.from(`${accountSid}:${authToken}`).toString(
      'base64',
    );

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authorization}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          To: input.to,
          Body: input.body,
          ...(messagingServiceSid
            ? { MessagingServiceSid: messagingServiceSid }
            : { From: from as string }),
        }),
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      this.logger.error(
        `Appel Twilio impossible : ${error instanceof Error ? error.message : 'erreur inconnue'}`,
      );
      throw new BadGatewayException("Le service SMS n'a pas répondu");
    }

    const payload = (await response
      .json()
      .catch(() => null)) as TwilioMessage | null;

    if (!response.ok) {
      this.logger.warn(`Twilio a refusé l'envoi (HTTP ${response.status})`);
      if (response.status === 401 || response.status === 403) {
        throw new BadGatewayException('Identifiants Twilio refusés');
      }
      if (response.status === 400) {
        throw new BadRequestException(
          payload?.message ?? 'Twilio a refusé le message',
        );
      }
      throw new BadGatewayException(
        payload?.message ?? "Le service SMS n'a pas pu envoyer le message",
      );
    }

    return {
      sid: payload?.sid ?? '',
      status: payload?.status ?? 'queued',
      to: payload?.to ?? input.to,
    };
  }
}
