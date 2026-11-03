import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Establishment } from '../tenants/establishment.entity.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { EMPTY_DASHBOARD_FACTS } from './dashboard.facts.js';
import { buildDashboardSnapshot } from './dashboard.snapshot.js';
import type { DashboardResponseDto } from './dto/dashboard-response.dto.js';

/**
 * Lecture d'accueil du commerce courant.
 *
 * Les totaux viennent des journaux de ventes, de caisse et de stock. Ces
 * journaux ne sont pas encore enregistrés : la réponse est alors à zéro,
 * sans chiffre d'exemple. Aucune table de statistiques n'est tenue à jour.
 */
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Establishment)
    private readonly establishments: Repository<Establishment>,
  ) {}

  async summary(tenantId: string, now = new Date()): Promise<DashboardResponseDto> {
    const tenant = await this.tenants.findOne({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException('Commerce introuvable');
    }

    const establishment = await this.establishments.findOne({
      where: { tenantId },
      order: { createdAt: 'ASC' },
    });

    return buildDashboardSnapshot({
      currency: tenant.currency,
      timezone: establishment?.timezone ?? 'Africa/Kinshasa',
      now,
      facts: EMPTY_DASHBOARD_FACTS,
    });
  }
}
