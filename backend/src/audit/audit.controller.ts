import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../auth/guards/platform-admin.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { AuthPrincipal } from '../auth/jwt-payload.interface.js';
import { PlatformDashboardActivityDto } from '../tenants/dto/platform-dashboard-response.dto.js';
import { MembershipRole } from '../users/membership-role.enum.js';
import { AuditLogViewDto } from './dto/audit-log-view.dto.js';
import { AuditPlatformReadService } from './audit-platform-read.service.js';
import { AuditReadService } from './audit-read.service.js';

@ApiTags('audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditRead: AuditReadService,
    private readonly auditPlatform: AuditPlatformReadService,
  ) {}

  @Get('tenant')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles(MembershipRole.OWNER)
  @ApiOperation({
    summary:
      'Journal d’audit de l’établissement (équipe, droits, configuration locale)',
  })
  @ApiResponse({ status: 200, type: [AuditLogViewDto] })
  @ApiResponse({ status: 403, description: 'Rôle propriétaire requis' })
  listTenant(@CurrentUser() user: AuthPrincipal): Promise<AuditLogViewDto[]> {
    return this.auditRead.listForTenant(user.tenantId as string);
  }

  @Get('platform')
  @UseGuards(JwtAuthGuard, PlatformAdminGuard)
  @ApiOperation({
    summary: 'Journal d’audit plateforme (espaces, abonnements, admin)',
  })
  @ApiResponse({ status: 200, type: [PlatformDashboardActivityDto] })
  @ApiResponse({ status: 403, description: 'Super administrateur requis' })
  listPlatform(): Promise<PlatformDashboardActivityDto[]> {
    return this.auditPlatform.listActivity();
  }
}