import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../auth/guards/platform-admin.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { EstablishmentSettings } from './establishment-settings.entity.js';
import { Establishment } from './establishment.entity.js';
import { ExchangeRate } from './exchange-rate.entity.js';
import { ExpiryAlertRule } from './expiry-alert-rule.entity.js';
import { Plan } from './plan.entity.js';
import { PlansBootstrap } from './plans.bootstrap.js';
import { PlatformTenantsController } from './platform-tenants.controller.js';
import { Subscription } from './subscription.entity.js';
import { Tenant } from './tenant.entity.js';
import { TenantsController } from './tenants.controller.js';
import { TenantsService } from './tenants.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tenant,
      Establishment,
      Subscription,
      Plan,
      EstablishmentSettings,
      ExpiryAlertRule,
      ExchangeRate,
    ]),
  ],
  controllers: [TenantsController, PlatformTenantsController],
  providers: [
    TenantsService,
    PlansBootstrap,
    JwtAuthGuard,
    RolesGuard,
    PlatformAdminGuard,
  ],
  exports: [TenantsService],
})
export class TenantsModule {}
