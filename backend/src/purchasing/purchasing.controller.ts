import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import {
  CreateGoodsReceiptDto,
  CreatePurchaseDto,
  CreateSupplierDto,
  GoodsReceiptResponseDto,
  PurchaseResponseDto,
  SupplierResponseDto,
} from './dto/purchasing.dto.js';
import { PurchasingService } from './purchasing.service.js';

@ApiTags('achats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('purchasing')
export class PurchasingController {
  constructor(private readonly purchasing: PurchasingService) {}

  @Post('suppliers')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Créer un fournisseur' })
  @ApiCreatedResponse({ type: SupplierResponseDto })
  createSupplier(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateSupplierDto,
  ): Promise<SupplierResponseDto> {
    return this.purchasing.createSupplier(user.tenantId as string, dto);
  }

  @Post('purchases')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Créer une commande fournisseur (brouillon)' })
  @ApiCreatedResponse({ type: PurchaseResponseDto })
  createPurchase(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    return this.purchasing.createPurchase(
      user.tenantId as string,
      user.sub,
      dto,
    );
  }

  @Post('goods-receipts')
  @Roles(MembershipRole.OWNER, MembershipRole.STOCK_MANAGER)
  @ApiOperation({ summary: 'Créer un bon de réception (brouillon)' })
  @ApiCreatedResponse({ type: GoodsReceiptResponseDto })
  createGoodsReceipt(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateGoodsReceiptDto,
  ): Promise<GoodsReceiptResponseDto> {
    return this.purchasing.createGoodsReceipt(
      user.tenantId as string,
      user.sub,
      dto,
    );
  }

  @Post('goods-receipts/:receiptId/post')
  @Roles(MembershipRole.OWNER, MembershipRole.STOCK_MANAGER)
  @ApiOperation({
    summary: 'Valider une réception : stock, CUMP et mise à jour commande',
  })
  @ApiOkResponse({ type: GoodsReceiptResponseDto })
  postGoodsReceipt(
    @CurrentUser() user: AuthPrincipal,
    @Param('receiptId', ParseUUIDPipe) receiptId: string,
  ): Promise<GoodsReceiptResponseDto> {
    return this.purchasing.postGoodsReceipt(
      user.tenantId as string,
      user.sub,
      receiptId,
    );
  }
}
