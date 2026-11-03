import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './plan.entity.js';

/**
 * Garantit la présence des formules de référence (dictionnaire §3). La
 * migration PostgreSQL les insère ; ce service couvre SQLite (développement et
 * tests), où le schéma est créé par synchronisation.
 */
@Injectable()
export class PlansBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(PlansBootstrap.name);

  static readonly DEFAULTS = [
    { code: 'essential', name: 'Essentiel' },
    { code: 'control', name: 'Contrôle' },
  ];

  constructor(
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    for (const definition of PlansBootstrap.DEFAULTS) {
      const exists = await this.plans.findOne({
        where: { code: definition.code },
      });

      if (!exists) {
        await this.plans.save(this.plans.create(definition));
        this.logger.log(`Formule créée : ${definition.code}`);
      }
    }
  }

  findByCode(code: string): Promise<Plan | null> {
    return this.plans.findOne({ where: { code } });
  }
}
