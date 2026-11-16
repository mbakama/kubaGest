import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { Environment } from '../config/env.validation.js';
import { APP_MIGRATIONS } from './migrations.registry.js';

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
    migrations: APP_MIGRATIONS,
    migrationsRun: !synchronize,
    logging,
  };
}
