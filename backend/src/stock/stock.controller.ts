import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { AuthPrincipal } from '../auth/jwt-payload.interface.js';
import { MembershipRole } from '../users/membership-role.enum.js';
import { ReceiveStockDto, StockLineResponseDto } from './dto/stock.dto.js';
import { StockService } from './stock.service.js';

@ApiTags('stock')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('stock')
export class StockController {
  constructor(private readonly stock: StockService) {}

  @Get()
  @ApiOperation({ summary: 'Stock disponible par article' })
  @ApiOkResponse({ type: [StockLineResponseDto] })
  list(@CurrentUser() user: AuthPrincipal): Promise<StockLineResponseDto[]> {
    return this.stock.list(user.tenantId as string);
  }

  @Post('entries')
  @Roles(MembershipRole.OWNER, MembershipRole.CASHIER)
  @ApiOperation({
    summary: 'Enregistrer une réception de stock (entrée en unité de base)',
  })
  @ApiCreatedResponse({ type: StockLineResponseDto })
  receive(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: ReceiveStockDto,
  ): Promise<StockLineResponseDto> {
    return this.stock.receive(user.tenantId as string, user.sub, dto);
  }
}
