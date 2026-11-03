import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthPrincipal } from '../auth/jwt-payload.interface.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { CashService, type CashSessionView } from './cash.service.js';
import {
  CashSessionResponseDto,
  CloseCashSessionDto,
  OpenCashSessionDto,
} from './dto/cash.dto.js';

@ApiTags('caisse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('cash')
export class CashController {
  constructor(
    private readonly cash: CashService,
    private readonly catalog: CatalogService,
  ) {}

  @Get('sessions/current')
  @ApiOperation({ summary: 'Session de caisse ouverte du caissier' })
  @ApiOkResponse({ type: CashSessionResponseDto, description: 'Aucune session : null' })
  async current(
    @CurrentUser() user: AuthPrincipal,
  ): Promise<CashSessionView | null> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.cash.current(
      user.tenantId as string,
      establishment.id,
      user.sub,
    );
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Ouvrir une session de caisse' })
  @ApiOkResponse({ type: CashSessionResponseDto })
  async open(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: OpenCashSessionDto,
  ): Promise<CashSessionView> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.cash.open(user.tenantId as string, establishment.id, user.sub, dto);
  }

  @Post('sessions/:sessionId/close')
  @ApiOperation({ summary: 'Clôturer une session de caisse' })
  @ApiOkResponse({ type: CashSessionResponseDto })
  async close(
    @CurrentUser() user: AuthPrincipal,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() dto: CloseCashSessionDto,
  ): Promise<CashSessionView> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.cash.close(
      user.tenantId as string,
      establishment.id,
      user.sub,
      sessionId,
      dto,
    );
  }
}
