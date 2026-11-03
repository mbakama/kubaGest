import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { createObserveModule } from '@nestjs/observe';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuditModule } from './audit/audit.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { CashModule } from './cash/cash.module.js';
import { CreditsModule } from './credits/credits.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { validateEnv } from './config/env.validation.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { SalesModule } from './sales/sales.module.js';
import { SmsModule } from './sms/sms.module.js';
import { StockModule } from './stock/stock.module.js';
import { TenantsModule } from './tenants/tenants.module.js';
import { UsersModule } from './users/users.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

/**
 * La télémétrie Observe est optionnelle : elle n'est enregistrée que si les
 * identifiants sont fournis. ConfigModule.forRoot() étant évalué avant cet
 * appel dans le tableau `imports`, les variables du fichier `.env` sont déjà
 * chargées dans `process.env` à ce stade.
 */
function observeImports() {
  const appKey = process.env.OBSERVE_APP_KEY;
  const appSecret = process.env.OBSERVE_APP_SECRET;

  if (!appKey || !appSecret) {
    return [];
  }

  return [
    ObserveModule.forRoot({
      appKey,
      appSecret,
      serviceId: process.env.OBSERVE_SERVICE_ID ?? 'kubagest-backend',
    }),
  ];
}

@Module({
  imports: [
    // Charge `.env`, valide les variables au démarrage et rend ConfigService
    // disponible partout sans réimporter le module.
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    // Limitation de débit globale (§12), renforcée sur l'authentification.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    DatabaseModule,
    AuditModule,
    UsersModule,
    AuthModule,
    TenantsModule,
    CatalogModule,
    CashModule,
    StockModule,
    SalesModule,
    CreditsModule,
    DashboardModule,
    HealthModule,
    SmsModule,
    ...observeImports(),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
