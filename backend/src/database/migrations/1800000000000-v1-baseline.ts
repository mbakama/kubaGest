import type { MigrationInterface, QueryRunner } from 'typeorm';
import { InitialSchema1729700000000 } from './1729700000000-initial-schema.js';
import { TenantProfileAndSubscriptions1729800000000 } from './1729800000000-tenant-profile-and-subscriptions.js';
import { SocleAccountsPlansSettings1729900000000 } from './1729900000000-socle-accounts-plans-settings.js';
import { Catalog1730000000000 } from './1730000000000-catalog.js';
import { UserProfile1730100000000 } from './1730100000000-user-profile.js';
import { Credits1730200000000 } from './1730200000000-credits.js';
import { SalesCashStock1730300000000 } from './1730300000000-sales-cash-stock.js';
import { TargetV1Foundation1730400000000 } from './1730400000000-target-v1-foundation.js';
import { V1ModelCleanup1800005000000 } from './1800005000000-v1-model-cleanup.js';

/**
 * Baseline DEV V1.1.
 *
 * Les anciennes migrations sont appelées comme composants de construction,
 * mais ne sont plus enregistrées dans l'historique TypeORM. La dernière
 * étape retire immédiatement les structures de compatibilité : une base
 * vierge ne voit donc qu'une migration et aboutit au modèle V1.1 propre.
 * Ces composants seront supprimés physiquement après l'adaptation complète
 * des services (phase 4), sans changer le schéma produit par cette baseline.
 */
export class V1Baseline1800000000000 implements MigrationInterface {
  name = 'V1Baseline1800000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await new InitialSchema1729700000000().up(queryRunner);
    await new TenantProfileAndSubscriptions1729800000000().up(queryRunner);
    await new SocleAccountsPlansSettings1729900000000().up(queryRunner);
    await new Catalog1730000000000().up(queryRunner);
    await new UserProfile1730100000000().up(queryRunner);
    await new Credits1730200000000().up(queryRunner);
    await new SalesCashStock1730300000000().up(queryRunner);
    await new TargetV1Foundation1730400000000().up(queryRunner);
    await new V1ModelCleanup1800005000000().up(queryRunner);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Baseline réservée aux bases DEV vierges. Le rollback supprime uniquement
    // les objets métier gérés par cette baseline, jamais le schéma PostgreSQL.
    await queryRunner.query(`
      DROP TABLE IF EXISTS "sync_operations", "stock_allocation_items",
        "stock_allocations", "authorized_terminals", "expenses",
        "inventory_count_items", "inventory_counts", "stock_transfer_items",
        "stock_transfers", "product_valuations", "sale_line_batch_allocations",
        "goods_receipt_items", "goods_receipts", "product_batches",
        "purchase_items", "purchases", "suppliers", "stock_movements",
        "stock_balances", "credit_reminders", "cash_movements", "payments",
        "sale_items", "credit_payments", "credit_sales", "customers", "sales",
        "cash_session_currencies", "cash_sessions", "cash_registers",
        "document_counters", "product_prices", "product_barcodes",
        "drug_details", "product_packagings", "establishment_products",
        "physical_products", "product_categories", "membership_warehouses",
        "warehouses", "exchange_rates", "expiry_alert_rules",
        "establishment_settings", "access_tokens", "auth_sessions",
        "membership_permissions", "subscriptions", "plans", "audit_logs",
        "memberships", "users", "establishments", "tenants" CASCADE
    `);
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "prevent_immutable_journal_change"()`,
    );
  }
}
