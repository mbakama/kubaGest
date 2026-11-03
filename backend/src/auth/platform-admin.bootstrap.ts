import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { hashPassword } from '../common/password.js';
import type { Environment } from '../config/env.validation.js';
import { User } from '../users/user.entity.js';

/**
 * Crée (ou promeut) le super administrateur plateforme au démarrage, à partir
 * de `PLATFORM_ADMIN_EMAIL` / `PLATFORM_ADMIN_PASSWORD` (§3, §28.6 : comptes de
 * démonstration sans secret versionné). Sans ces variables, aucune action.
 */
@Injectable()
export class PlatformAdminBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(PlatformAdminBootstrap.name);

  constructor(
    private readonly config: ConfigService<Environment, true>,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.get('PLATFORM_ADMIN_EMAIL', { infer: true });
    const password = this.config.get('PLATFORM_ADMIN_PASSWORD', {
      infer: true,
    });

    if (!email || !password) {
      return;
    }

    const normalized = email.trim().toLowerCase();
    const existing = await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: normalized } });

    if (existing) {
      if (!existing.isPlatformAdmin) {
        existing.isPlatformAdmin = true;
        await this.dataSource.getRepository(User).save(existing);
        this.logger.log(
          `Compte ${normalized} promu super administrateur plateforme`,
        );
      }
      return;
    }

    await this.dataSource.getRepository(User).save(
      this.dataSource.getRepository(User).create({
        email: normalized,
        passwordHash: await hashPassword(password),
        isPlatformAdmin: true,
      }),
    );
    this.logger.log(`Super administrateur plateforme créé (${normalized})`);
  }
}
