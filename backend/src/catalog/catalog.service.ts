import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, IsNull, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { Establishment } from '../tenants/entities/establishment.entity.js';
import { Tenant } from '../tenants/entities/tenant.entity.js';
import { ActivityType } from '../core/tenants/activity-type.enum.js';
import { AllocationPolicy, TrackingMode } from './catalog.enums.js';
import { DrugDetails } from './drug-details.entity.js';
import { EstablishmentProduct } from './establishment-product.entity.js';
import { PhysicalProduct } from './physical-product.entity.js';
import { ProductBarcode } from './product-barcode.entity.js';
import { ProductCategory } from './product-category.entity.js';
import { ProductPackaging } from './product-packaging.entity.js';
import { ProductPrice } from './product-price.entity.js';
import { ListProductsQueryDto, UpdateCategoryDto } from './dto/category.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { CreatePackagingDto, UpdatePackagingDto } from './dto/packaging.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import type {
  BarcodeResponseDto,
  PackagingResponseDto,
  ProductCategoryResponseDto,
  ProductResponseDto,
} from './dto/product-response.dto.js';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categories: Repository<ProductCategory>,
    @InjectRepository(PhysicalProduct)
    private readonly products: Repository<PhysicalProduct>,
    @InjectRepository(EstablishmentProduct)
    private readonly activations: Repository<EstablishmentProduct>,
    @InjectRepository(ProductPackaging)
    private readonly packagings: Repository<ProductPackaging>,
    @InjectRepository(ProductPrice)
    private readonly prices: Repository<ProductPrice>,
    @InjectRepository(ProductBarcode)
    private readonly barcodes: Repository<ProductBarcode>,
    @InjectRepository(DrugDetails)
    private readonly drugDetails: Repository<DrugDetails>,
    @InjectRepository(Establishment)
    private readonly establishments: Repository<Establishment>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  async resolveEstablishment(tenantId: string): Promise<Establishment> {
    const rows = await this.establishments.find({
      where: { tenantId, isActive: true },
      order: { createdAt: 'ASC' },
      take: 2,
    });
    if (rows.length === 0)
      throw new NotFoundException('Établissement introuvable');
    return rows[0];
  }

  async listCategories(
    tenantId: string,
    _establishmentId?: string,
  ): Promise<ProductCategoryResponseDto[]> {
    return this.categories.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  async createCategory(
    tenantId: string,
    _establishmentId: string,
    actorId: string,
    name: string,
    isActive: boolean,
  ): Promise<ProductCategoryResponseDto> {
    const normalized = name.trim();
    return this.dataSource.transaction(async (manager) => {
      const duplicate = await manager
        .createQueryBuilder(ProductCategory, 'category')
        .where('category.tenant_id = :tenantId', { tenantId })
        .andWhere('lower(category.name) = lower(:name)', { name: normalized })
        .getOne();
      if (duplicate) throw new ConflictException('Cette catégorie existe déjà');
      const row = await manager.save(
        manager.create(ProductCategory, {
          tenantId,
          parentId: null,
          name: normalized,
          isActive,
        }),
      );
      await this.audit.record(
        {
          tenantId,
          actorId,
          action: 'category.created',
          entityType: 'product_category',
          entityId: row.id,
        },
        manager,
      );
      return row;
    });
  }

  async updateCategory(
    tenantId: string,
    _establishmentId: string,
    actorId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ): Promise<ProductCategoryResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const row = await manager.findOne(ProductCategory, {
        where: { id: categoryId, tenantId },
      });
      if (!row) throw new NotFoundException('Catégorie introuvable');
      if (dto.name !== undefined) row.name = dto.name.trim();
      if (dto.isActive !== undefined) row.isActive = dto.isActive;
      await manager.save(row);
      await this.audit.record(
        {
          tenantId,
          actorId,
          action: 'category.updated',
          entityType: 'product_category',
          entityId: row.id,
        },
        manager,
      );
      return row;
    });
  }

  async listProducts(
    tenantId: string,
    establishmentId: string,
    query: ListProductsQueryDto,
  ): Promise<ProductResponseDto[]> {
    const activations = await this.activations.find({
      where: {
        tenantId,
        establishmentId,
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      },
    });
    if (!activations.length) return [];
    let products = await this.products.find({
      where: {
        tenantId,
        id: In(activations.map((row) => row.physicalProductId)),
      },
      order: { name: 'ASC' },
    });
    const search = query.search?.trim().toLowerCase();
    if (search)
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search),
      );
    return this.assemble(
      tenantId,
      establishmentId,
      products,
      activations,
      query.includePackagings !== false,
    );
  }

  async getProduct(
    tenantId: string,
    establishmentId: string,
    productId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.products.findOne({
      where: { id: productId, tenantId },
    });
    const activation = await this.activations.findOne({
      where: { tenantId, establishmentId, physicalProductId: productId },
    });
    if (!product || !activation)
      throw new NotFoundException('Article introuvable');
    return (
      await this.assemble(
        tenantId,
        establishmentId,
        [product],
        [activation],
        true,
      )
    )[0];
  }

  async createProduct(
    tenantId: string,
    establishment: Establishment,
    actorId: string,
    dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const trackingMode = dto.drugDetails
      ? (dto.trackingMode ?? TrackingMode.BATCH_EXPIRY)
      : (dto.trackingMode ?? TrackingMode.NONE);
    const allocationPolicy = dto.drugDetails
      ? (dto.allocationPolicy ?? AllocationPolicy.FEFO)
      : (dto.allocationPolicy ?? AllocationPolicy.FIFO);
    this.assertPharmacyRules(
      establishment,
      trackingMode,
      allocationPolicy,
      dto.drugDetails !== undefined,
    );
    const productId = await this.dataSource.transaction(async (manager) => {
      await this.assertCategory(manager, tenantId, dto.categoryId);
      const sku = dto.sku.trim().toUpperCase();
      if (
        await manager
          .createQueryBuilder(PhysicalProduct, 'product')
          .where('product.tenant_id = :tenantId', { tenantId })
          .andWhere('LOWER(product.sku) = LOWER(:sku)', { sku })
          .getOne()
      ) {
        throw new ConflictException('Ce SKU est déjà utilisé');
      }
      const product = await manager.save(
        manager.create(PhysicalProduct, {
          tenantId,
          sku,
          name: dto.name.trim(),
          description: null,
          baseUnit: dto.baseUnit.trim(),
          trackingMode,
          isActive: dto.isActive ?? true,
        }),
      );
      await manager.save(
        manager.create(EstablishmentProduct, {
          tenantId,
          establishmentId: establishment.id,
          physicalProductId: product.id,
          categoryId: dto.categoryId ?? null,
          localName: null,
          reorderLevel: dto.reorderLevel ?? 0,
          allocationPolicy,
          taxRate: dto.taxRate ?? '0',
          isActive: dto.isActive ?? true,
        }),
      );
      const packaging = await manager.save(
        manager.create(ProductPackaging, {
          tenantId,
          physicalProductId: product.id,
          label: dto.basePackaging.label.trim(),
          factorToBase: 1,
          isBase: true,
          isActive: true,
        }),
      );
      const tenant = await manager.findOneOrFail(Tenant, {
        where: { id: tenantId },
      });
      await manager.save(
        manager.create(ProductPrice, {
          tenantId,
          establishmentId: establishment.id,
          physicalProductId: product.id,
          packagingId: packaging.id,
          salePrice: dto.basePackaging.salePrice,
          currency: tenant.currency,
          validFrom: new Date(),
          validTo: null,
        }),
      );
      for (const code of this.normalizeCodes(dto.barcodes ?? [])) {
        if (
          await manager.findOne(ProductBarcode, { where: { tenantId, code } })
        )
          throw new ConflictException(`Code-barres déjà utilisé : ${code}`);
        await manager.save(
          manager.create(ProductBarcode, {
            tenantId,
            physicalProductId: product.id,
            packagingId: packaging.id,
            code,
          }),
        );
      }
      if (dto.drugDetails)
        await manager.save(
          manager.create(DrugDetails, {
            tenantId,
            physicalProductId: product.id,
            activeIngredient: dto.drugDetails.activeIngredient.trim(),
            strength: dto.drugDetails.strength.trim(),
            dosageForm: dto.drugDetails.dosageForm.trim(),
            prescriptionRequired: dto.drugDetails.prescriptionRequired ?? null,
          }),
        );
      await this.audit.record(
        {
          tenantId,
          establishmentId: establishment.id,
          actorId,
          action: 'product.created',
          entityType: 'physical_product',
          entityId: product.id,
        },
        manager,
      );
      return product.id;
    });
    return this.getProduct(tenantId, establishment.id, productId);
  }

  async updateProduct(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const { product, activation } = await this.getOwnedProduct(
        manager,
        tenantId,
        establishmentId,
        productId,
      );
      await this.assertCategory(manager, tenantId, dto.categoryId);
      if (dto.sku !== undefined) {
        const sku = dto.sku.trim().toUpperCase();
        const duplicate = await manager
          .createQueryBuilder(PhysicalProduct, 'candidate')
          .where('candidate.tenant_id = :tenantId', { tenantId })
          .andWhere('LOWER(candidate.sku) = LOWER(:sku)', { sku })
          .andWhere('candidate.id <> :productId', { productId })
          .getOne();
        if (duplicate) throw new ConflictException('Ce SKU est déjà utilisé');
        product.sku = sku;
      }
      if (dto.name !== undefined) product.name = dto.name.trim();
      if (dto.baseUnit !== undefined) product.baseUnit = dto.baseUnit.trim();
      if (dto.trackingMode !== undefined)
        product.trackingMode = dto.trackingMode;
      if (dto.categoryId !== undefined) activation.categoryId = dto.categoryId;
      if (dto.reorderLevel !== undefined)
        activation.reorderLevel = dto.reorderLevel;
      if (dto.allocationPolicy !== undefined)
        activation.allocationPolicy = dto.allocationPolicy;
      if (dto.taxRate !== undefined) activation.taxRate = dto.taxRate;
      if (dto.isActive !== undefined) activation.isActive = dto.isActive;
      const drug = await manager.findOne(DrugDetails, {
        where: { tenantId, physicalProductId: productId },
      });
      if (
        drug &&
        (product.trackingMode !== TrackingMode.BATCH_EXPIRY ||
          activation.allocationPolicy !== AllocationPolicy.FEFO)
      ) {
        throw new BadRequestException(
          'Un médicament exige le suivi lot/péremption et FEFO',
        );
      }
      await manager.save([product, activation]);
      await this.audit.record(
        {
          tenantId,
          establishmentId,
          actorId,
          action: 'product.updated',
          entityType: 'physical_product',
          entityId: product.id,
        },
        manager,
      );
    });
    return this.getProduct(tenantId, establishmentId, productId);
  }

  async createPackaging(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    dto: CreatePackagingDto,
  ): Promise<PackagingResponseDto> {
    const id = await this.dataSource.transaction(async (manager) => {
      await this.getOwnedProduct(manager, tenantId, establishmentId, productId);
      const label = dto.label.trim();
      const duplicate = await manager
        .createQueryBuilder(ProductPackaging, 'packaging')
        .where('packaging.tenant_id = :tenantId', { tenantId })
        .andWhere('packaging.physical_product_id = :productId', { productId })
        .andWhere('LOWER(packaging.label) = LOWER(:label)', { label })
        .getOne();
      if (duplicate)
        throw new ConflictException('Ce conditionnement existe déjà');
      const packaging = await manager.save(
        manager.create(ProductPackaging, {
          tenantId,
          physicalProductId: productId,
          label,
          factorToBase: dto.factorToBase,
          isBase: false,
          isActive: dto.isActive ?? true,
        }),
      );
      const tenant = await manager.findOneOrFail(Tenant, {
        where: { id: tenantId },
      });
      await manager.save(
        manager.create(ProductPrice, {
          tenantId,
          establishmentId,
          physicalProductId: productId,
          packagingId: packaging.id,
          salePrice: dto.salePrice,
          currency: tenant.currency,
          validFrom: new Date(),
          validTo: null,
        }),
      );
      await this.audit.record(
        {
          tenantId,
          establishmentId,
          actorId,
          action: 'packaging.created',
          entityType: 'product_packaging',
          entityId: packaging.id,
        },
        manager,
      );
      return packaging.id;
    });
    return this.packagingResponse(tenantId, establishmentId, id);
  }

  async updatePackaging(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    packagingId: string,
    dto: UpdatePackagingDto,
  ): Promise<PackagingResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      await this.getOwnedProduct(manager, tenantId, establishmentId, productId);
      const row = await manager.findOne(ProductPackaging, {
        where: { id: packagingId, tenantId, physicalProductId: productId },
      });
      if (!row) throw new NotFoundException('Conditionnement introuvable');
      if (row.isBase && (dto.isActive === false || dto.isBase === false))
        throw new BadRequestException(
          'Le conditionnement de base doit rester actif et défini comme base',
        );
      if (dto.label !== undefined) {
        const label = dto.label.trim();
        const duplicate = await manager
          .createQueryBuilder(ProductPackaging, 'packaging')
          .where('packaging.tenant_id = :tenantId', { tenantId })
          .andWhere('packaging.physical_product_id = :productId', {
            productId,
          })
          .andWhere('LOWER(packaging.label) = LOWER(:label)', { label })
          .andWhere('packaging.id <> :packagingId', { packagingId })
          .getOne();
        if (duplicate)
          throw new ConflictException('Ce conditionnement existe déjà');
        row.label = label;
      }
      if (dto.factorToBase !== undefined) row.factorToBase = dto.factorToBase;
      if (dto.isActive !== undefined) row.isActive = dto.isActive;
      if (dto.isBase === true) {
        if (row.factorToBase !== 1)
          throw new BadRequestException(
            'Le conditionnement de base doit avoir un facteur de 1',
          );
        await manager.update(
          ProductPackaging,
          { tenantId, physicalProductId: productId, isBase: true },
          { isBase: false },
        );
        row.isBase = true;
      }
      await manager.save(row);
      if (dto.salePrice !== undefined)
        await this.replacePrice(
          manager,
          tenantId,
          establishmentId,
          productId,
          packagingId,
          dto.salePrice,
        );
      await this.audit.record(
        {
          tenantId,
          establishmentId,
          actorId,
          action: 'packaging.updated',
          entityType: 'product_packaging',
          entityId: row.id,
        },
        manager,
      );
    });
    return this.packagingResponse(tenantId, establishmentId, packagingId);
  }

  async createBarcode(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    rawCode: string,
  ): Promise<BarcodeResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      await this.getOwnedProduct(manager, tenantId, establishmentId, productId);
      const code = rawCode.trim();
      if (await manager.findOne(ProductBarcode, { where: { tenantId, code } }))
        throw new ConflictException('Ce code-barres est déjà utilisé');
      const base = await manager.findOne(ProductPackaging, {
        where: {
          tenantId,
          physicalProductId: productId,
          isBase: true,
          isActive: true,
        },
      });
      if (!base)
        throw new BadRequestException('Conditionnement de base introuvable');
      const row = await manager.save(
        manager.create(ProductBarcode, {
          tenantId,
          physicalProductId: productId,
          packagingId: base.id,
          code,
        }),
      );
      await this.audit.record(
        {
          tenantId,
          establishmentId,
          actorId,
          action: 'barcode.created',
          entityType: 'product_barcode',
          entityId: row.id,
        },
        manager,
      );
      return { id: row.id, code: row.code, packagingId: row.packagingId };
    });
  }

  async deleteBarcode(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    barcodeId: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await this.getOwnedProduct(manager, tenantId, establishmentId, productId);
      const row = await manager.findOne(ProductBarcode, {
        where: { id: barcodeId, tenantId, physicalProductId: productId },
      });
      if (!row) throw new NotFoundException('Code-barres introuvable');
      await manager.remove(row);
      await this.audit.record(
        {
          tenantId,
          establishmentId,
          actorId,
          action: 'barcode.deleted',
          entityType: 'product_barcode',
          entityId: row.id,
        },
        manager,
      );
    });
  }

  private async assemble(
    tenantId: string,
    establishmentId: string,
    products: PhysicalProduct[],
    activations: EstablishmentProduct[],
    include: boolean,
  ): Promise<ProductResponseDto[]> {
    const ids = products.map((p) => p.id);
    const [packagings, prices, barcodes, drugs] =
      ids.length && include
        ? await Promise.all([
            this.packagings.find({
              where: { tenantId, physicalProductId: In(ids) },
            }),
            this.prices.find({
              where: {
                tenantId,
                establishmentId,
                physicalProductId: In(ids),
                validTo: IsNull(),
              },
            }),
            this.barcodes.find({
              where: { tenantId, physicalProductId: In(ids) },
            }),
            this.drugDetails.find({
              where: { tenantId, physicalProductId: In(ids) },
            }),
          ])
        : ([[], [], [], []] as [
            ProductPackaging[],
            ProductPrice[],
            ProductBarcode[],
            DrugDetails[],
          ]);
    const activationMap = new Map(
      activations.map((a) => [a.physicalProductId, a]),
    );
    const priceMap = new Map(prices.map((p) => [p.packagingId, p.salePrice]));
    return products.map((product) => {
      const activation = activationMap.get(product.id) as EstablishmentProduct;
      return {
        id: product.id,
        sku: product.sku,
        name: activation.localName ?? product.name,
        categoryId: activation.categoryId,
        baseUnit: product.baseUnit,
        reorderLevel: activation.reorderLevel,
        trackingMode: product.trackingMode,
        allocationPolicy: activation.allocationPolicy,
        taxRate: activation.taxRate,
        isActive: activation.isActive,
        packagings: packagings
          .filter((p) => p.physicalProductId === product.id)
          .map((p) => ({
            id: p.id,
            label: p.label,
            factorToBase: p.factorToBase,
            salePrice: priceMap.get(p.id) ?? '0.000000',
            isBase: p.isBase,
            isActive: p.isActive,
          })),
        barcodes: barcodes
          .filter((b) => b.physicalProductId === product.id)
          .map((b) => ({ id: b.id, code: b.code, packagingId: b.packagingId })),
        drugDetails: (() => {
          const d = drugs.find((x) => x.physicalProductId === product.id);
          return d
            ? {
                activeIngredient: d.activeIngredient,
                strength: d.strength,
                dosageForm: d.dosageForm,
                prescriptionRequired: d.prescriptionRequired,
              }
            : null;
        })(),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });
  }

  private async getOwnedProduct(
    manager: EntityManager,
    tenantId: string,
    establishmentId: string,
    productId: string,
  ) {
    const [product, activation] = await Promise.all([
      manager.findOne(PhysicalProduct, { where: { id: productId, tenantId } }),
      manager.findOne(EstablishmentProduct, {
        where: { tenantId, establishmentId, physicalProductId: productId },
      }),
    ]);
    if (!product || !activation)
      throw new NotFoundException('Article introuvable');
    return { product, activation };
  }

  private async assertCategory(
    manager: EntityManager,
    tenantId: string,
    categoryId?: string | null,
  ): Promise<void> {
    if (
      categoryId &&
      !(await manager.findOne(ProductCategory, {
        where: { id: categoryId, tenantId, isActive: true },
      }))
    ) {
      throw new NotFoundException('Catégorie introuvable');
    }
  }

  private assertPharmacyRules(
    establishment: Establishment,
    tracking?: TrackingMode,
    allocation?: AllocationPolicy,
    hasDrug = false,
  ): void {
    if (hasDrug && establishment.activityType !== ActivityType.PHARMACIE)
      throw new BadRequestException(
        'Les médicaments sont réservés aux pharmacies',
      );
    if (
      hasDrug &&
      (tracking !== TrackingMode.BATCH_EXPIRY ||
        allocation !== AllocationPolicy.FEFO)
    )
      throw new BadRequestException(
        'Un médicament exige le suivi lot/péremption et FEFO',
      );
  }

  private normalizeCodes(codes: string[]): string[] {
    return [...new Set(codes.map((c) => c.trim()).filter(Boolean))];
  }

  private async replacePrice(
    manager: EntityManager,
    tenantId: string,
    establishmentId: string,
    productId: string,
    packagingId: string,
    amount: string,
  ): Promise<void> {
    const current = await manager.findOne(ProductPrice, {
      where: {
        tenantId,
        establishmentId,
        physicalProductId: productId,
        packagingId,
        validTo: IsNull(),
      },
    });
    const now = new Date();
    if (current) {
      current.validTo = now;
      await manager.save(current);
    }
    const tenant = await manager.findOneOrFail(Tenant, {
      where: { id: tenantId },
    });
    await manager.save(
      manager.create(ProductPrice, {
        tenantId,
        establishmentId,
        physicalProductId: productId,
        packagingId,
        salePrice: amount,
        currency: tenant.currency,
        validFrom: now,
        validTo: null,
      }),
    );
  }

  private async packagingResponse(
    tenantId: string,
    establishmentId: string,
    packagingId: string,
  ): Promise<PackagingResponseDto> {
    const row = await this.packagings.findOne({
      where: { id: packagingId, tenantId },
    });
    if (!row) throw new NotFoundException('Conditionnement introuvable');
    const price = await this.prices.findOne({
      where: { tenantId, establishmentId, packagingId, validTo: IsNull() },
    });
    return {
      id: row.id,
      label: row.label,
      factorToBase: row.factorToBase,
      salePrice: price?.salePrice ?? '0.000000',
      isBase: row.isBase,
      isActive: row.isActive,
    };
  }
}
