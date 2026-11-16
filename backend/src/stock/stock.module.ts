import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { EstablishmentProduct } from '../catalog/establishment-product.entity.js';
import { PhysicalProduct } from '../catalog/physical-product.entity.js';
import { Warehouse } from '../tenants/entities/warehouse.entity.js';
import { StockBalance } from './stock-balance.entity.js';
import { StockController } from './stock.controller.js';
import { StockMovement } from './stock-movement.entity.js';
import { ProductValuation } from './product-valuation.entity.js';
import { ProductValuationService } from './product-valuation.service.js';
import { StockService } from './stock.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockBalance,
      StockMovement,
      PhysicalProduct,
      EstablishmentProduct,
      Warehouse,
      ProductValuation,
    ]),
    CatalogModule,
  ],
  controllers: [StockController],
  providers: [
    StockService,
    ProductValuationService,
    JwtAuthGuard,
    TenantGuard,
    RolesGuard,
  ],
  exports: [StockService],
})
export class StockModule {}
