import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { JwtAuthGuard, TenantGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import type { AuthPrincipal } from '../../auth/jwt-payload.interface.js';
import { MembershipRole } from '../../users/membership-role.enum.js';
import { CurrentExchangeRateResponseDto } from '../dto/current-exchange-rate-response.dto.js';
import {
  EstablishmentResponseDto,
  TenantDetailResponseDto,
  WarehouseResponseDto,
} from '../dto/tenant-response.dto.js';
import {
  CreateEstablishmentDto,
  CreateWarehouseDto,
} from '../dto/organization.dto.js';
import { UpdateTenantDto } from '../dto/update-tenant.dto.js';
import { TenantsService } from './tenants.service.js';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('current')
  @ApiOperation({
    summary: 'Profil du tenant courant (devise, statut, formule, abonnement)',
  })
  @ApiResponse({ status: 200, type: TenantDetailResponseDto })
  @ApiResponse({ status: 403, description: 'Jeton sans contexte tenant' })
  getCurrent(
    @CurrentUser() user: AuthPrincipal,
  ): Promise<TenantDetailResponseDto> {
    // Le tenant vient du jeton, jamais d'un paramètre client.
    return this.tenantsService.getCurrent(user.tenantId as string);
  }

  @Patch('current')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({
    summary: 'Modifier le profil du tenant (nom, devise, adresse)',
  })
  @ApiResponse({ status: 200, type: TenantDetailResponseDto })
  @ApiResponse({ status: 403, description: 'Rôle propriétaire requis' })
  updateCurrent(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: UpdateTenantDto,
  ): Promise<TenantDetailResponseDto> {
    return this.tenantsService.updateCurrent(
      user.tenantId as string,
      user.sub,
      dto,
    );
  }

  @Get('current/exchange-rate')
  @ApiOperation({
    summary: 'Taux BCC du jour (1 USD en CDF) pour l’établissement principal',
  })
  @ApiResponse({ status: 200, type: CurrentExchangeRateResponseDto })
  getCurrentExchangeRate(
    @CurrentUser() user: AuthPrincipal,
  ): Promise<CurrentExchangeRateResponseDto> {
    return this.tenantsService.getCurrentExchangeRate(user.tenantId as string);
  }

  @Get('current/establishments')
  @ApiOperation({ summary: 'Établissements du tenant courant' })
  @ApiResponse({ status: 200, type: [EstablishmentResponseDto] })
  listEstablishments(
    @CurrentUser() user: AuthPrincipal,
  ): Promise<EstablishmentResponseDto[]> {
    return this.tenantsService.listEstablishments(user.tenantId as string);
  }

  @Post('current/establishments')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Créer un établissement et son entrepôt principal' })
  @ApiResponse({ status: 201, type: EstablishmentResponseDto })
  createEstablishment(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateEstablishmentDto,
  ): Promise<EstablishmentResponseDto> {
    return this.tenantsService.createEstablishment(
      user.tenantId as string,
      user.sub,
      dto,
    );
  }

  @Get('current/warehouses')
  @ApiOperation({ summary: 'Lister les entrepôts du tenant courant' })
  @ApiResponse({ status: 200, type: [WarehouseResponseDto] })
  listWarehouses(
    @CurrentUser() user: AuthPrincipal,
  ): Promise<WarehouseResponseDto[]> {
    return this.tenantsService.listWarehouses(user.tenantId as string);
  }

  @Post('current/establishments/:establishmentId/warehouses')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Créer un entrepôt secondaire' })
  @ApiResponse({ status: 201, type: WarehouseResponseDto })
  createWarehouse(
    @CurrentUser() user: AuthPrincipal,
    @Param('establishmentId', ParseUUIDPipe) establishmentId: string,
    @Body() dto: CreateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    return this.tenantsService.createWarehouse(
      user.tenantId as string,
      establishmentId,
      user.sub,
      dto,
    );
  }
}
