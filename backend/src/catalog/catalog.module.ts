import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Establishment } from '../tenants/establishment.entity.js';
import { CatalogService } from './catalog.service.js';
import {
  ProductCategoriesController,
  ProductsController,
} from './catalog.controller.js';
import { DrugDetails } from './drug-details.entity.js';
import { ProductBarcode } from './product-barcode.entity.js';
import { ProductCategory } from './product-category.entity.js';
import { ProductPackaging } from './product-packaging.entity.js';
import { Product } from './product.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategory,
      Product,
      ProductPackaging,
      ProductBarcode,
      DrugDetails,
      Establishment,
    ]),
  ],
  controllers: [ProductCategoriesController, ProductsController],
  providers: [CatalogService, JwtAuthGuard, RolesGuard],
  exports: [CatalogService],
})
export class CatalogModule {}
