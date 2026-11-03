import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { AuthPrincipal } from '../auth/jwt-payload.interface.js';
import { MembershipRole } from '../users/membership-role.enum.js';
import { CatalogService } from './catalog.service.js';
import {
  CreateCategoryDto,
  ListProductsQueryDto,
  UpdateCategoryDto,
} from './dto/category.dto.js';
import { CreateBarcodeDto } from './dto/create-barcode.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { CreatePackagingDto, UpdatePackagingDto } from './dto/packaging.dto.js';
import {
  BarcodeResponseDto,
  PackagingResponseDto,
  ProductCategoryResponseDto,
  ProductResponseDto,
} from './dto/product-response.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@ApiTags('catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les catégories du point de vente' })
  @ApiResponse({ status: 200, type: [ProductCategoryResponseDto] })
  async list(
    @CurrentUser() user: AuthPrincipal,
  ): Promise<ProductCategoryResponseDto[]> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.listCategories(user.tenantId as string, establishment.id);
  }

  @Post()
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Créer une catégorie (propriétaire)' })
  @ApiResponse({ status: 201, type: ProductCategoryResponseDto })
  @ApiResponse({ status: 409, description: 'Nom déjà utilisé' })
  async create(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateCategoryDto,
  ): Promise<ProductCategoryResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.createCategory(
      user.tenantId as string,
      establishment.id,
      user.sub,
      dto.name,
      dto.isActive ?? true,
    );
  }

  @Patch(':categoryId')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Modifier une catégorie (propriétaire)' })
  @ApiResponse({ status: 200, type: ProductCategoryResponseDto })
  async update(
    @CurrentUser() user: AuthPrincipal,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<ProductCategoryResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.updateCategory(
      user.tenantId as string,
      establishment.id,
      user.sub,
      categoryId,
      dto,
    );
  }
}

@ApiTags('catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister le catalogue (recherche par nom ou SKU)',
  })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async list(
    @CurrentUser() user: AuthPrincipal,
    @Query() query: ListProductsQueryDto,
  ): Promise<ProductResponseDto[]> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.listProducts(
      user.tenantId as string,
      establishment.id,
      query,
    );
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Détail d’un article (conditionnements, codes)' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  async get(
    @CurrentUser() user: AuthPrincipal,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.getProduct(
      user.tenantId as string,
      establishment.id,
      productId,
    );
  }

  @Post()
  @Roles(MembershipRole.OWNER)
  @ApiOperation({
    summary:
      'Créer un article avec son conditionnement de base (propriétaire)',
  })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @ApiResponse({ status: 409, description: 'SKU ou code-barres déjà utilisé' })
  async create(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.createProduct(
      user.tenantId as string,
      establishment,
      user.sub,
      dto,
    );
  }

  @Patch(':productId')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Modifier un article (propriétaire)' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async update(
    @CurrentUser() user: AuthPrincipal,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.updateProduct(
      user.tenantId as string,
      establishment.id,
      user.sub,
      productId,
      dto,
    );
  }

  @Post(':productId/packagings')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Ajouter un conditionnement (propriétaire)' })
  @ApiResponse({ status: 201, type: PackagingResponseDto })
  async createPackaging(
    @CurrentUser() user: AuthPrincipal,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreatePackagingDto,
  ): Promise<PackagingResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.createPackaging(
      user.tenantId as string,
      establishment.id,
      user.sub,
      productId,
      dto,
    );
  }

  @Patch(':productId/packagings/:packagingId')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Modifier un conditionnement (propriétaire)' })
  @ApiResponse({ status: 200, type: PackagingResponseDto })
  async updatePackaging(
    @CurrentUser() user: AuthPrincipal,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('packagingId', ParseUUIDPipe) packagingId: string,
    @Body() dto: UpdatePackagingDto,
  ): Promise<PackagingResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.updatePackaging(
      user.tenantId as string,
      establishment.id,
      user.sub,
      productId,
      packagingId,
      dto,
    );
  }

  @Post(':productId/barcodes')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({
    summary: 'Ajouter un code-barres (conditionnement de base par défaut)',
  })
  @ApiResponse({ status: 201, type: BarcodeResponseDto })
  @ApiResponse({ status: 409, description: 'Code déjà rattaché' })
  async createBarcode(
    @CurrentUser() user: AuthPrincipal,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreateBarcodeDto,
  ): Promise<BarcodeResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.createBarcode(
      user.tenantId as string,
      establishment.id,
      user.sub,
      productId,
      dto.code,
    );
  }

  @Delete(':productId/barcodes/:barcodeId')
  @Roles(MembershipRole.OWNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un code-barres (propriétaire)' })
  @ApiResponse({ status: 204 })
  async deleteBarcode(
    @CurrentUser() user: AuthPrincipal,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('barcodeId', ParseUUIDPipe) barcodeId: string,
  ): Promise<void> {
    const establishment = await this.catalog.resolveEstablishment(
      user.tenantId as string,
    );
    return this.catalog.deleteBarcode(
      user.tenantId as string,
      establishment.id,
      user.sub,
      productId,
      barcodeId,
    );
  }
}
