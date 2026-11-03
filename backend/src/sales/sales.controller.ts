import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthPrincipal } from '../auth/jwt-payload.interface.js';
import { CreateSaleDto, SaleResponseDto } from './dto/sale.dto.js';
import { SalesService } from './sales.service.js';

class ListSalesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}

@ApiTags('ventes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly sales: SalesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Encaisser un ticket : ventes en espèces, sortie de stock, caisse et crédit',
  })
  @ApiCreatedResponse({ type: SaleResponseDto })
  async create(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateSaleDto,
  ): Promise<SaleResponseDto> {
    return this.sales.create(user.tenantId as string, user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Derniers tickets du point de vente' })
  @ApiOkResponse({ type: [SaleResponseDto] })
  async list(
    @CurrentUser() user: AuthPrincipal,
    @Query() query: ListSalesQueryDto,
  ): Promise<SaleResponseDto[]> {
    return this.sales.list(user.tenantId as string, query.limit ?? 50);
  }
}
