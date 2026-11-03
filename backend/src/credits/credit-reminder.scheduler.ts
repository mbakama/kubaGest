import { Injectable, Logger } from '@nestjs/common';
import type { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import type { Environment } from '../config/env.validation.js';
import { CreditSale, CreditStatus } from './credit-sale.entity.js';
import { CreditsService } from './credits.service.js';

const SIX_HOURS = 6 * 60 * 60 * 1000;

/**
 * Relance périodique des crédits échus.
 *
 * Le service vérifie toutes les six heures les commerces ayant au moins une
 * échéance dépassée. `sendReminders` applique lui-même le délai de
 * refroidissement et n'envoie rien si les SMS ne sont pas configurés.
 * Désactivation : `CREDIT_REMINDERS_ENABLED=false` ; jamais actif en test.
 */
@Injectable()
export class CreditReminderScheduler
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(CreditReminderScheduler.name);
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly config: ConfigService<Environment, true>,
    private readonly dataSource: DataSource,
    private readonly credits: CreditsService,
  ) {}

  onApplicationBootstrap(): void {
    if (this.config.get('NODE_ENV', { infer: true }) === 'test') return;
    if (!this.config.get('CREDIT_REMINDERS_ENABLED', { infer: true })) return;

    this.timer = setInterval(() => void this.run(), SIX_HOURS);
    this.timer.unref();
  }

  onApplicationShutdown(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async run(now = new Date()): Promise<void> {
    if (this.running) return;
    this.running = true;

    try {
      const today = now.toISOString().slice(0, 10);
      const rows = await this.dataSource
        .getRepository(CreditSale)
        .createQueryBuilder('credit')
        .select('credit.tenantId', 'tenantId')
        .where('credit.status = :status', { status: CreditStatus.OPEN })
        .andWhere('credit.dueDate < :today', { today })
        .groupBy('credit.tenantId')
        .getRawMany<{ tenantId: string }>();

      for (const row of rows) {
        try {
          const result = await this.credits.sendReminders(row.tenantId, null);
          if (result.sent > 0) {
            this.logger.log(
              `${result.sent} relance(s) de crédit envoyée(s) pour ${row.tenantId}`,
            );
          }
        } catch (error) {
          this.logger.warn(
            `Relance impossible pour ${row.tenantId} : ` +
              (error instanceof Error ? error.message : 'erreur inconnue'),
          );
        }
      }
    } finally {
      this.running = false;
    }
  }
}
