import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { PhysicalProduct } from '../catalog/physical-product.entity.js';
import { StockModule } from '../stock/stock.module.js';
import { Warehouse } from '../tenants/entities/warehouse.entity.js';
import { UsersModule } from '../users/users.module.js';
import { GoodsReceiptItem } from './goods-receipt-item.entity.js';
import { GoodsReceipt } from './goods-receipt.entity.js';
import { PurchaseItem } from './purchase-item.entity.js';
import { Purchase } from './purchase.entity.js';
import { PurchasingController } from './purchasing.controller.js';
import { PurchasingService } from './purchasing.service.js';
import { Supplier } from './supplier.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supplier,
      Purchase,
      PurchaseItem,
      GoodsReceipt,
      GoodsReceiptItem,
      PhysicalProduct,
      Warehouse,
    ]),
    StockModule,
    UsersModule,
  ],
  controllers: [PurchasingController],
  providers: [PurchasingService, JwtAuthGuard, TenantGuard, RolesGuard],
  exports: [PurchasingService],
})
export class PurchasingModule {}
