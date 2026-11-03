import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { CashController } from './cash.controller.js';
import { CashMovement } from './cash-movement.entity.js';
import { CashRegister } from './cash-register.entity.js';
import { CashSessionCurrency } from './cash-session-currency.entity.js';
import { CashSession } from './cash-session.entity.js';
import { CashService } from './cash.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CashRegister,
      CashSession,
      CashSessionCurrency,
      CashMovement,
      Tenant,
    ]),
    CatalogModule,
  ],
  controllers: [CashController],
  providers: [CashService, JwtAuthGuard, TenantGuard],
  exports: [CashService],
})
export class CashModule {}
