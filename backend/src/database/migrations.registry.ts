import type { MigrationInterface } from 'typeorm';
import { InitialSchema1729700000000 } from './migrations/1729700000000-initial-schema.js';
import { TenantProfileAndSubscriptions1729800000000 } from './migrations/1729800000000-tenant-profile-and-subscriptions.js';
import { SocleAccountsPlansSettings1729900000000 } from './migrations/1729900000000-socle-accounts-plans-settings.js';
import { Catalog1730000000000 } from './migrations/1730000000000-catalog.js';
import { UserProfile1730100000000 } from './migrations/1730100000000-user-profile.js';
import { Credits1730200000000 } from './migrations/1730200000000-credits.js';
import { SalesCashStock1730300000000 } from './migrations/1730300000000-sales-cash-stock.js';
import { TargetV1Foundation1730400000000 } from './migrations/1730400000000-target-v1-foundation.js';
import { V1ModelCleanup1800005000000 } from './migrations/1800005000000-v1-model-cleanup.js';
import { UserSex1800100000000 } from './migrations/1800100000000-user-sex.js';

type MigrationCtor = new () => MigrationInterface;

/**
 * Chaîne officielle pour bases existantes et nouvelles installations.
 * `V1Baseline1800000000000` est réservée aux réinitialisations documentées
 * (ré-exécution complète sur base vide), pas enregistrée ici.
 */
const MIGRATION_CTORS: MigrationCtor[] = [
  InitialSchema1729700000000,
  TenantProfileAndSubscriptions1729800000000,
  SocleAccountsPlansSettings1729900000000,
  Catalog1730000000000,
  UserProfile1730100000000,
  Credits1730200000000,
  SalesCashStock1730300000000,
  TargetV1Foundation1730400000000,
  V1ModelCleanup1800005000000,
  UserSex1800100000000,
];

/** Constructeurs attendus par TypeORM (`migrations` accepte des classes). */
export const APP_MIGRATIONS: MigrationCtor[] = [...MIGRATION_CTORS];
