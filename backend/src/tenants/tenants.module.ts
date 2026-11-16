import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../auth/guards/platform-admin.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { EstablishmentSettings } from './entities/establishment-settings.entity.js';
import { Establishment } from './entities/establishment.entity.js';
import { ExchangeRate } from './entities/exchange-rate.entity.js';
import { ExpiryAlertRule } from './entities/expiry-alert-rule.entity.js';
import { Plan } from './entities/plan.entity.js';
import { PlansBootstrap } from './plans.bootstrap.js';
import { UsersModule } from '../users/users.module.js';
import { User } from '../users/user.entity.js';
import { PlatformDashboardController } from './platform-dashboard/platform-dashboard.controller.js';
import { PlatformDashboardService } from './platform-dashboard/platform-dashboard.service.js';
import { PlatformProfileController } from './platform-profile/platform-profile.controller.js';
import { PlatformProfileService } from './platform-profile/platform-profile.service.js';
import { PlatformTenantsController } from './platform-tenants/platform-tenants.controller.js';
import { Subscription } from './entities/subscription.entity.js';
import { Tenant } from './entities/tenant.entity.js';
import { TenantsController } from './tenants/tenants.controller.js';
import { TenantsService } from './tenants/tenants.service.js';
import { Warehouse } from './entities/warehouse.entity.js';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      Tenant,
      Establishment,
      Subscription,
      Plan,
      EstablishmentSettings,
      ExpiryAlertRule,
      ExchangeRate,
      Warehouse,
      User,
    ]),
  ],
  controllers: [
    TenantsController,
    PlatformTenantsController,
    PlatformDashboardController,
    PlatformProfileController,
  ],
  providers: [
    TenantsService,
    PlatformDashboardService,
    PlatformProfileService,
    PlansBootstrap,
    JwtAuthGuard,
    RolesGuard,
    PlatformAdminGuard,
  ],
  exports: [TenantsService],
})
export class TenantsModule {}
