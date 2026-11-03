import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { Environment } from '../config/env.validation.js';
import { InitialSchema1729700000000 } from './migrations/1729700000000-initial-schema.js';
import { TenantProfileAndSubscriptions1729800000000 } from './migrations/1729800000000-tenant-profile-and-subscriptions.js';
import { SocleAccountsPlansSettings1729900000000 } from './migrations/1729900000000-socle-accounts-plans-settings.js';
import { Catalog1730000000000 } from './migrations/1730000000000-catalog.js';
import { Credits1730200000000 } from './migrations/1730200000000-credits.js';
import { SalesCashStock1730300000000 } from './migrations/1730300000000-sales-cash-stock.js';
import { UserProfile1730100000000 } from './migrations/1730100000000-user-profile.js';

/**
 * Construit la configuration TypeORM à partir des variables d'environnement.
 *
 * - `DB_TYPE=postgres` : base de référence (production, docker-compose). Les
 *   migrations versionnées s'exécutent au démarrage si `DB_SYNCHRONIZE=false`.
 * - `DB_TYPE=sqljs` : SQLite local (mémoire ou fichier). Réservé au
 *   développement et aux tests ; le schéma est créé par synchronisation.
 */
export function buildTypeOrmOptions(
  config: ConfigService<Environment, true>,
): TypeOrmModuleOptions {
  const synchronize = config.get('DB_SYNCHRONIZE', { infer: true });
  const logging = config.get('DB_LOGGING', { infer: true });

  if (config.get('DB_TYPE', { infer: true }) === 'sqljs') {
    const location = config.get('DB_LOCATION', { infer: true });

    if (location) {
      mkdirSync(dirname(resolve(location)), { recursive: true });
    }

    return {
      type: 'sqljs',
      location,
      autoSave: Boolean(location),
      autoLoadEntities: true,
      // Les migrations de ce projet sont PostgreSQL ; SQLite est réservé au
      // développement et doit rester en synchronisation.
      synchronize: true,
      migrationsRun: false,
      logging,
    };
  }

  return {
    type: 'postgres',
    url: config.get('DATABASE_URL', { infer: true }),
    autoLoadEntities: true,
    synchronize,
    migrations: [
      InitialSchema1729700000000,
      TenantProfileAndSubscriptions1729800000000,
      SocleAccountsPlansSettings1729900000000,
      Catalog1730000000000,
      UserProfile1730100000000,
      Credits1730200000000,
      SalesCashStock1730300000000,
    ],
    migrationsRun: !synchronize,
    logging,
  };
}
