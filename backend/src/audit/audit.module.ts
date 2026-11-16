import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../auth/guards/platform-admin.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Tenant } from '../tenants/entities/tenant.entity.js';
import { User } from '../users/user.entity.js';
import { AuditController } from './audit.controller.js';
import { AuditLog } from './audit-log.entity.js';
import { AuditPlatformReadService } from './audit-platform-read.service.js';
import { AuditReadService } from './audit-read.service.js';
import { AuditService } from './audit.service.js';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, User, Tenant])],
  controllers: [AuditController],
  providers: [
    AuditService,
    AuditReadService,
    AuditPlatformReadService,
    JwtAuthGuard,
    RolesGuard,
    PlatformAdminGuard,
  ],
  exports: [AuditService, AuditReadService, AuditPlatformReadService],
})
export class AuditModule {}