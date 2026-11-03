import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../auth/guards/platform-admin.guard.js';
import type { AuthPrincipal } from '../auth/jwt-payload.interface.js';
import { ListTenantsQueryDto } from './dto/list-tenants-query.dto.js';
import { PlatformTenantResponseDto } from './dto/tenant-response.dto.js';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto.js';
import { TenantsService } from './tenants.service.js';

@ApiTags('platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PlatformAdminGuard)
@Controller('platform/tenants')
export class PlatformTenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les tenants et leur abonnement (super administrateur)',
  })
  @ApiResponse({ status: 200, type: [PlatformTenantResponseDto] })
  @ApiResponse({ status: 403, description: 'Super administrateur requis' })
  list(
    @Query() query: ListTenantsQueryDto,
  ): Promise<PlatformTenantResponseDto[]> {
    return this.tenantsService.listForPlatform(query);
  }

  @Patch(':tenantId/subscription')
  @ApiOperation({
    summary: "Paramétrer la formule, le statut et l'échéance d'un tenant",
  })
  @ApiResponse({ status: 200, type: PlatformTenantResponseDto })
  @ApiResponse({ status: 403, description: 'Super administrateur requis' })
  updateSubscription(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: UpdateSubscriptionDto,
  ): Promise<PlatformTenantResponseDto> {
    return this.tenantsService.updateSubscription(tenantId, user.sub, dto);
  }
}
