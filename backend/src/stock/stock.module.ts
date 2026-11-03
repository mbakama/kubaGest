import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { Product } from '../catalog/product.entity.js';
import { StockBalance } from './stock-balance.entity.js';
import { StockController } from './stock.controller.js';
import { StockMovement } from './stock-movement.entity.js';
import { StockService } from './stock.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockBalance, StockMovement, Product]),
    CatalogModule,
  ],
  controllers: [StockController],
  providers: [StockService, JwtAuthGuard, TenantGuard, RolesGuard],
  exports: [StockService],
})
export class StockModule {}
