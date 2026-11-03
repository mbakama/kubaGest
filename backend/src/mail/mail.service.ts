import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { Environment } from '../config/env.validation.js';

export type OutgoingMail = {
  to: string;
  subject: string;
  text: string;
};

function formatFrom(address: string, name?: string): string {
  if (!name) {
    return address;
  }

  return `"${name.replace(/["\\]/g, '')}" <${address}>`;
}

/**
 * Envoie un courriel par SMTP. Sans la configuration complète, l'appel échoue
 * explicitement : aucun message n'est annoncé comme parti.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService<Environment, true>) {}

  async send(mail: OutgoingMail): Promise<void> {
    const driver = this.config.get('MAIL_DRIVER', { infer: true });
    const host = this.config.get('MAIL_HOST', { infer: true });
    const port = this.config.get('MAIL_PORT', { infer: true });
    const user = this.config.get('MAIL_USERNAME', { infer: true });
    const password = this.config.get('MAIL_PASSWORD', { infer: true });
    const fromAddress = this.config.get('MAIL_FROM_ADDRESS', { infer: true });
    const fromName = this.config.get('MAIL_FROM_NAME', { infer: true });
    const encryption = this.config.get('MAIL_ENCRYPTION', { infer: true });

    if (
      driver !== 'smtp' ||
      !host ||
      !port ||
      !user ||
      !password ||
      !fromAddress
    ) {
      throw new ServiceUnavailableException(
        'L’envoi d’email n’est pas configuré',
      );
    }

    // Le port 465 ouvre une session SSL dès la connexion. Le port 587,
    // y compris lorsque MAIL_ENCRYPTION=ssl, chiffre ensuite par STARTTLS.
    const implicitTls = encryption === 'ssl' && port === 465;
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: implicitTls,
      requireTLS: !implicitTls,
      auth: { user, pass: password },
      connectionTimeout: 10_000,
      socketTimeout: 15_000,
    });

    try {
      await transport.sendMail({
        from: formatFrom(fromAddress, fromName),
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
      });
    } catch (error) {
      this.logger.error(
        `Envoi SMTP impossible : ${error instanceof Error ? error.message : 'erreur inconnue'}`,
      );
      throw new BadGatewayException(
        "Le message n'a pas pu être envoyé. Réessayez.",
      );
    } finally {
      transport.close();
    }
  }
}
