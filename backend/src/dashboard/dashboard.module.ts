import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Establishment } from '../tenants/establishment.entity.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Establishment])],
  controllers: [DashboardController],
  providers: [DashboardService, JwtAuthGuard, TenantGuard, RolesGuard],
})
export class DashboardModule {}
