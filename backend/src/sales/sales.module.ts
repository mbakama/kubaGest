import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { CashModule } from '../cash/cash.module.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { CreditsModule } from '../credits/credits.module.js';
import { DocumentCounter } from '../documents/document-counter.entity.js';
import { DocumentNumberService } from '../documents/document-number.service.js';
import { StockModule } from '../stock/stock.module.js';
import { SaleItem } from './sale-item.entity.js';
import { SalePayment } from './sale-payment.entity.js';
import { Sale } from './sale.entity.js';
import { SalesController } from './sales.controller.js';
import { SalesService } from './sales.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, SalePayment, DocumentCounter]),
    CatalogModule,
    CashModule,
    StockModule,
    CreditsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService, DocumentNumberService, JwtAuthGuard, TenantGuard],
})
export class SalesModule {}
