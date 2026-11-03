import 'dotenv/config';
import { DataSource } from 'typeorm';
import { InitialSchema1729700000000 } from './migrations/1729700000000-initial-schema.js';
import { TenantProfileAndSubscriptions1729800000000 } from './migrations/1729800000000-tenant-profile-and-subscriptions.js';
import { SocleAccountsPlansSettings1729900000000 } from './migrations/1729900000000-socle-accounts-plans-settings.js';
import { Catalog1730000000000 } from './migrations/1730000000000-catalog.js';
import { UserProfile1730100000000 } from './migrations/1730100000000-user-profile.js';
import { Credits1730200000000 } from './migrations/1730200000000-credits.js';
import { SalesCashStock1730300000000 } from './migrations/1730300000000-sales-cash-stock.js';

/**
 * Source de données utilisée par la CLI TypeORM (migrations exécutées à la
 * main, hors application). L'application, elle, construit sa connexion via
 * `buildTypeOrmOptions` avec ConfigService.
 *
 * Usage : `npm run migration:run` (compile puis applique les migrations).
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  migrations: [
    InitialSchema1729700000000,
    TenantProfileAndSubscriptions1729800000000,
    SocleAccountsPlansSettings1729900000000,
    Catalog1730000000000,
    UserProfile1730100000000,
    Credits1730200000000,
    SalesCashStock1730300000000,
  ],
  migrationsTableName: 'migrations',
});
