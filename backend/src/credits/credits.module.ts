import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CashModule } from '../cash/cash.module.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { DocumentCounter } from '../documents/document-counter.entity.js';
import { DocumentNumberService } from '../documents/document-number.service.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { CreditPayment } from './credit-payment.entity.js';
import { CreditReminder } from './credit-reminder.entity.js';
import { CreditReminderScheduler } from './credit-reminder.scheduler.js';
import { CreditSale } from './credit-sale.entity.js';
import { CreditsService } from './credits.service.js';
import {
  CreditsController,
  CustomersController,
} from './credits.controller.js';
import { Customer } from './customer.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      CreditSale,
      CreditPayment,
      CreditReminder,
      Tenant,
      DocumentCounter,
    ]),
    CatalogModule,
    CashModule,
  ],
  controllers: [CustomersController, CreditsController],
  providers: [
    CreditsService,
    DocumentNumberService,
    CreditReminderScheduler,
    JwtAuthGuard,
    TenantGuard,
    RolesGuard,
  ],
  exports: [CreditsService],
})
export class CreditsModule {}
