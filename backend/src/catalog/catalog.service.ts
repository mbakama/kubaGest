import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { ActivityType } from '../tenants/activity-type.enum.js';
import { Establishment } from '../tenants/establishment.entity.js';
import { AllocationPolicy, TrackingMode } from './catalog.enums.js';
import { DrugDetails } from './drug-details.entity.js';
import { ListProductsQueryDto } from './dto/category.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import {
  BarcodeResponseDto,
  DrugDetailsResponseDto,
  PackagingResponseDto,
  ProductCategoryResponseDto,
  ProductResponseDto,
} from './dto/product-response.dto.js';
import { CreatePackagingDto, UpdatePackagingDto } from './dto/packaging.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductBarcode } from './product-barcode.entity.js';
import { ProductCategory } from './product-category.entity.js';
import { ProductPackaging } from './product-packaging.entity.js';
import { Product } from './product.entity.js';

function toCategory(entity: ProductCategory): ProductCategoryResponseDto {
  return {
    id: entity.id,
    name: entity.name,
    isActive: entity.isActive,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function toPackaging(entity: ProductPackaging): PackagingResponseDto {
  return {
    id: entity.id,
    label: entity.label,
    factorToBase: entity.factorToBase,
    salePrice: entity.salePrice,
    isBase: entity.isBase,
    isActive: entity.isActive,
  };
}

function toBarcode(entity: ProductBarcode): BarcodeResponseDto {
  return {
    id: entity.id,
    code: entity.code,
    packagingId: entity.packagingId,
  };
}

function toDrugDetails(entity: DrugDetails | null): DrugDetailsResponseDto | null {
  return entity
    ? {
        activeIngredient: entity.activeIngredient,
        strength: entity.strength,
        dosageForm: entity.dosageForm,
        prescriptionRequired: entity.prescriptionRequired,
      }
    : null;
}

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categories: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(ProductPackaging)
    private readonly packagings: Repository<ProductPackaging>,
    @InjectRepository(ProductBarcode)
    private readonly barcodes: Repository<ProductBarcode>,
    @InjectRepository(DrugDetails)
    private readonly drugDetails: Repository<DrugDetails>,
    @InjectRepository(Establishment)
    private readonly establishments: Repository<Establishment>,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  /**
   * Point de vente courant du tenant. Le MVP limite un commerce à un
   * établissement (`UNIQUE(tenant_id)`), donc la résolution est univoque.
   */
  async resolveEstablishment(tenantId: string): Promise<Establishment> {
    const establishment = await this.establishments.findOne({
      where: { tenantId },
      order: { createdAt: 'ASC' },
    });

    if (!establishment) {
      throw new NotFoundException("Aucun établissement pour ce commerce");
    }

    return establishment;
  }

  // --- Catégories ----------------------------------------------------------

  listCategories(
    tenantId: string,
    establishmentId: string,
  ): Promise<ProductCategoryResponseDto[]> {
    return this.categories
      .find({
        where: { tenantId, establishmentId },
        order: { name: 'ASC' },
      })
      .then((entities) => entities.map(toCategory));
  }

  async createCategory(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    name: string,
    isActive = true,
  ): Promise<ProductCategoryResponseDto> {
    const normalized = name.trim();

    const existing = await this.categories
      .createQueryBuilder('category')
      .where('category.tenantId = :tenantId', { tenantId })
      .andWhere('category.establishmentId = :establishmentId', {
        establishmentId,
      })
      .andWhere('lower(category.name) = lower(:name)', { name: normalized })
      .getOne();

    if (existing) {
      throw new ConflictException('Une catégorie porte déjà ce nom');
    }

    return this.dataSource.transaction(async (manager) => {
      const category = await manager.save(
        manager.create(ProductCategory, {
          tenantId,
          establishmentId,
          name: normalized,
          isActive,
        }),
      );

      await this.audit.record(
        {
          action: 'product_category.created',
          entityType: 'product_category',
          entityId: category.id,
          tenantId,
          establishmentId,
          actorId,
          newValues: { name: category.name },
        },
        manager,
      );

      return toCategory(category);
    });
  }

  async updateCategory(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    categoryId: string,
    changes: { name?: string; isActive?: boolean },
  ): Promise<ProductCategoryResponseDto> {
    if (changes.name === undefined && changes.isActive === undefined) {
      throw new BadRequestException('Aucune modification fournie');
    }

    return this.dataSource.transaction(async (manager) => {
      const category = await manager.findOne(ProductCategory, {
        where: { id: categoryId, tenantId, establishmentId },
      });

      if (!category) {
        throw new NotFoundException('Catégorie introuvable');
      }

      const oldValues = { name: category.name, isActive: category.isActive };

      if (changes.name !== undefined) {
        category.name = changes.name.trim();
      }
      if (changes.isActive !== undefined) {
        category.isActive = changes.isActive;
      }

      await manager.save(category);
      await this.audit.record(
        {
          action: 'product_category.updated',
          entityType: 'product_category',
          entityId: category.id,
          tenantId,
          establishmentId,
          actorId,
          oldValues,
          newValues: { name: category.name, isActive: category.isActive },
        },
        manager,
      );

      return toCategory(category);
    });
  }

  // --- Articles ------------------------------------------------------------

  async listProducts(
    tenantId: string,
    establishmentId: string,
    query: ListProductsQueryDto,
  ): Promise<ProductResponseDto[]> {
    const builder = this.products
      .createQueryBuilder('product')
      .where('product.tenantId = :tenantId', { tenantId })
      .andWhere('product.establishmentId = :establishmentId', {
        establishmentId,
      })
      .orderBy('product.name', 'ASC');

    if (query.search) {
      // `LOWER(...) LIKE` reste portable PostgreSQL / SQLite (tests).
      builder.andWhere(
        '(LOWER(product.name) LIKE :search OR LOWER(product.sku) LIKE :search)',
        { search: `%${query.search.trim().toLowerCase()}%` },
      );
    }
    if (query.categoryId) {
      builder.andWhere('product.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }
    if (query.isActive !== undefined) {
      builder.andWhere('product.isActive = :isActive', {
        isActive: query.isActive,
      });
    }

    const products = await builder.getMany();
    const includePackagings = query.includePackagings !== false;

    return this.assemble(
      products,
      includePackagings,
      includePackagings,
      includePackagings,
    );
  }

  async getProduct(
    tenantId: string,
    establishmentId: string,
    productId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.products.findOne({
      where: { id: productId, tenantId, establishmentId },
    });

    if (!product) {
      throw new NotFoundException('Article introuvable');
    }

    const [view] = await this.assemble([product], true, true, true);
    return view;
  }

  async createProduct(
    tenantId: string,
    establishment: Establishment,
    actorId: string,
    dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const sku = dto.sku.trim().toUpperCase();
    const isPharmacy = establishment.activityType === ActivityType.PHARMACIE;

    if (dto.drugDetails && !isPharmacy) {
      throw new BadRequestException(
        'Les informations médicament sont réservées aux pharmacies',
      );
    }

    // F08/F10 : une pharmacie impose le suivi par lot avec péremption et FEFO.
    const trackingMode =
      dto.trackingMode ??
      (dto.drugDetails ? TrackingMode.BATCH_EXPIRY : TrackingMode.NONE);
    const allocationPolicy =
      dto.allocationPolicy ??
      (dto.drugDetails ? AllocationPolicy.FEFO : AllocationPolicy.FIFO);

    if (
      dto.drugDetails &&
      (trackingMode !== TrackingMode.BATCH_EXPIRY ||
        allocationPolicy !== AllocationPolicy.FEFO)
    ) {
      throw new BadRequestException(
        'Un médicament exige tracking_mode=batch_expiry et allocation_policy=fefo',
      );
    }

    this.assertTaxRate(dto.taxRate ?? '0');

    const existingSku = await this.products.findOne({
      where: { tenantId, sku },
    });
    if (existingSku) {
      throw new ConflictException('Ce SKU est déjà utilisé dans ce commerce');
    }

    if (dto.categoryId) {
      await this.assertCategory(tenantId, establishment.id, dto.categoryId);
    }

    const codes = this.normalizeCodes(dto.barcodes ?? []);
    await this.assertBarcodesAvailable(tenantId, codes);

    const product = await this.dataSource.transaction(async (manager) => {
      const created = await manager.save(
        manager.create(Product, {
          tenantId,
          establishmentId: establishment.id,
          categoryId: dto.categoryId ?? null,
          sku,
          name: dto.name.trim(),
          baseUnit: dto.baseUnit.trim(),
          reorderLevel: dto.reorderLevel ?? 0,
          trackingMode,
          allocationPolicy,
          taxRate: dto.taxRate ?? '0',
          isActive: dto.isActive ?? true,
        }),
      );

      // Au moins un conditionnement est requis : la base porte le prix unitaire.
      const basePackaging = await manager.save(
        manager.create(ProductPackaging, {
          tenantId,
          establishmentId: establishment.id,
          productId: created.id,
          label: dto.basePackaging.label.trim(),
          factorToBase: 1,
          salePrice: dto.basePackaging.salePrice,
          isBase: true,
          isActive: true,
        }),
      );

      if (codes.length > 0) {
        await manager.save(
          codes.map((code) =>
            manager.create(ProductBarcode, {
              tenantId,
              establishmentId: establishment.id,
              productId: created.id,
              packagingId: basePackaging.id,
              code,
            }),
          ),
        );
      }

      if (dto.drugDetails) {
        await manager.save(
          manager.create(DrugDetails, {
            tenantId,
            establishmentId: establishment.id,
            productId: created.id,
            activeIngredient: dto.drugDetails.activeIngredient.trim(),
            strength: dto.drugDetails.strength.trim(),
            dosageForm: dto.drugDetails.dosageForm.trim(),
            prescriptionRequired:
              dto.drugDetails.prescriptionRequired ?? null,
          }),
        );
      }

      await this.audit.record(
        {
          action: 'product.created',
          entityType: 'product',
          entityId: created.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          newValues: {
            sku,
            name: created.name,
            baseUnit: created.baseUnit,
            trackingMode,
            allocationPolicy,
          },
        },
        manager,
      );

      return created;
    });

    return this.getProduct(tenantId, establishment.id, product.id);
  }

  async updateProduct(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const fields = Object.entries(dto).filter(
      ([, value]) => value !== undefined,
    );

    if (fields.length === 0) {
      throw new BadRequestException('Aucune modification fournie');
    }

    if (dto.taxRate !== undefined) {
      this.assertTaxRate(dto.taxRate);
    }

    if (dto.categoryId) {
      await this.assertCategory(tenantId, establishmentId, dto.categoryId);
    }

    await this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: productId, tenantId, establishmentId },
      });

      if (!product) {
        throw new NotFoundException('Article introuvable');
      }

      const oldValues = {
        sku: product.sku,
        name: product.name,
        baseUnit: product.baseUnit,
        categoryId: product.categoryId,
        reorderLevel: product.reorderLevel,
        trackingMode: product.trackingMode,
        allocationPolicy: product.allocationPolicy,
        taxRate: product.taxRate,
        isActive: product.isActive,
      };

      if (dto.sku !== undefined) {
        const sku = dto.sku.trim().toUpperCase();
        const duplicate = await manager.findOne(Product, {
          where: { tenantId, sku },
        });
        if (duplicate && duplicate.id !== product.id) {
          throw new ConflictException(
            'Ce SKU est déjà utilisé dans ce commerce',
          );
        }
        product.sku = sku;
      }
      if (dto.name !== undefined) product.name = dto.name.trim();
      if (dto.baseUnit !== undefined) product.baseUnit = dto.baseUnit.trim();
      if (dto.categoryId !== undefined) product.categoryId = dto.categoryId;
      if (dto.reorderLevel !== undefined)
        product.reorderLevel = dto.reorderLevel;
      if (dto.trackingMode !== undefined)
        product.trackingMode = dto.trackingMode;
      if (dto.allocationPolicy !== undefined)
        product.allocationPolicy = dto.allocationPolicy;
      if (dto.taxRate !== undefined) product.taxRate = dto.taxRate;
      if (dto.isActive !== undefined) product.isActive = dto.isActive;

      // Un médicament ne peut pas perdre le suivi par lot ni la FEFO.
      const drug = await manager.findOne(DrugDetails, {
        where: { tenantId, establishmentId, productId },
      });
      if (
        drug &&
        (product.trackingMode !== TrackingMode.BATCH_EXPIRY ||
          product.allocationPolicy !== AllocationPolicy.FEFO)
      ) {
        throw new BadRequestException(
          'Un médicament exige tracking_mode=batch_expiry et allocation_policy=fefo',
        );
      }

      await manager.save(product);
      await this.audit.record(
        {
          action: 'product.updated',
          entityType: 'product',
          entityId: product.id,
          tenantId,
          establishmentId,
          actorId,
          oldValues,
          newValues: {
            sku: product.sku,
            name: product.name,
            baseUnit: product.baseUnit,
            categoryId: product.categoryId,
            reorderLevel: product.reorderLevel,
            trackingMode: product.trackingMode,
            allocationPolicy: product.allocationPolicy,
            taxRate: product.taxRate,
            isActive: product.isActive,
          },
        },
        manager,
      );
    });

    return this.getProduct(tenantId, establishmentId, productId);
  }

  // --- Conditionnements ----------------------------------------------------

  async createPackaging(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    dto: CreatePackagingDto,
  ): Promise<PackagingResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      await this.getOwnedProduct(manager, tenantId, establishmentId, productId);

      const label = dto.label.trim();
      await this.assertPackagingLabel(
        manager,
        tenantId,
        establishmentId,
        productId,
        label,
      );

      const packaging = await manager.save(
        manager.create(ProductPackaging, {
          tenantId,
          establishmentId,
          productId,
          label,
          factorToBase: dto.factorToBase,
          salePrice: dto.salePrice,
          // La base est créée avec l'article ; un ajout est secondaire.
          isBase: false,
          isActive: dto.isActive ?? true,
        }),
      );

      await this.audit.record(
        {
          action: 'product_packaging.created',
          entityType: 'product_packaging',
          entityId: packaging.id,
          tenantId,
          establishmentId,
          actorId,
          newValues: {
            productId,
            label,
            factorToBase: dto.factorToBase,
            salePrice: dto.salePrice,
          },
        },
        manager,
      );

      return toPackaging(packaging);
    });
  }

  async updatePackaging(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    packagingId: string,
    dto: UpdatePackagingDto,
  ): Promise<PackagingResponseDto> {
    const fields = Object.entries(dto).filter(
      ([, value]) => value !== undefined,
    );

    if (fields.length === 0) {
      throw new BadRequestException('Aucune modification fournie');
    }

    return this.dataSource.transaction(async (manager) => {
      await this.getOwnedProduct(manager, tenantId, establishmentId, productId);

      const packaging = await manager.findOne(ProductPackaging, {
        where: { id: packagingId, tenantId, establishmentId, productId },
      });

      if (!packaging) {
        throw new NotFoundException('Conditionnement introuvable');
      }

      const oldValues = {
        label: packaging.label,
        factorToBase: packaging.factorToBase,
        salePrice: packaging.salePrice,
        isBase: packaging.isBase,
        isActive: packaging.isActive,
      };

      if (dto.label !== undefined && dto.label.trim() !== packaging.label) {
        const label = dto.label.trim();
        await this.assertPackagingLabel(
          manager,
          tenantId,
          establishmentId,
          productId,
          label,
          packaging.id,
        );
        packaging.label = label;
      }

      if (dto.factorToBase !== undefined) {
        if (packaging.isBase && dto.factorToBase !== 1) {
          throw new BadRequestException(
            'Le conditionnement de base conserve un facteur de 1',
          );
        }
        packaging.factorToBase = dto.factorToBase;
      }

      if (dto.salePrice !== undefined) {
        packaging.salePrice = dto.salePrice;
      }

      if (dto.isActive !== undefined) {
        if (!dto.isActive && packaging.isBase) {
          throw new BadRequestException(
            'Le conditionnement de base ne peut pas être désactivé ; promouvez d’abord un autre conditionnement',
          );
        }
        packaging.isActive = dto.isActive;
      }

      if (dto.isBase === true && !packaging.isBase) {
        if (packaging.factorToBase !== 1) {
          throw new BadRequestException(
            'Un conditionnement de base doit avoir un facteur de 1',
          );
        }

        // Une seule base par article : l'ancienne est rétrogradée.
        await manager.update(
          ProductPackaging,
          { tenantId, establishmentId, productId, isBase: true },
          { isBase: false },
        );
        packaging.isBase = true;
        packaging.isActive = true;
      }

      await manager.save(packaging);
      await this.audit.record(
        {
          action: 'product_packaging.updated',
          entityType: 'product_packaging',
          entityId: packaging.id,
          tenantId,
          establishmentId,
          actorId,
          oldValues,
          newValues: {
            label: packaging.label,
            factorToBase: packaging.factorToBase,
            salePrice: packaging.salePrice,
            isBase: packaging.isBase,
            isActive: packaging.isActive,
          },
        },
        manager,
      );

      return toPackaging(packaging);
    });
  }

  // --- Codes-barres --------------------------------------------------------

  async createBarcode(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    productId: string,
    code: string,
    packagingId?: string,
  ): Promise<BarcodeResponseDto> {
    const normalized = code.trim();

    if (normalized.length === 0) {
      throw new BadRequestException('Le code-barres ne peut pas être vide');
    }

    return this.dataSource.transaction(async (manager) => {
      await this.getOwnedProduct(manager, tenantId, establishmentId, productId);

      const existing = await manager.findOne(ProductBarcode, {
        where: { tenantId, code: normalized },
      });
      if (existing) {
        throw new ConflictException(
          'Ce code-barres est déjà rattaché à un article',
        );
      }

      let targetPackagingId = packagingId;

      if (targetPackagingId) {
        const packaging = await manager.findOne(ProductPackaging, {
          where: {
            id: targetPackagingId,
            tenantId,
            establishmentId,
            productId,
          },
        });
        if (!packaging) {
          throw new NotFoundException('Conditionnement introuvable');
        }
      } else {
        const base = await manager.findOne(ProductPackaging, {
          where: { tenantId, establishmentId, productId, isBase: true },
        });
        if (!base) {
          throw new BadRequestException(
            "Aucun conditionnement de base pour cet article",
          );
        }
        targetPackagingId = base.id;
      }

      const barcode = await manager.save(
        manager.create(ProductBarcode, {
          tenantId,
          establishmentId,
          productId,
          packagingId: targetPackagingId,
          code: normalized,
        }),
      );

      await this.audit.record(
        {
          action: 'product_barcode.created',
          entityType: 'product_barcode',
          entityId: barcode.id,
          tenantId,
          establishmentId,
          actorId,
          newValues: { productId, code: normalized },
        },
        manager,
      );

      return toBarcode(barcode);
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
      const barcode = await manager.findOne(ProductBarcode, {
        where: { id: barcodeId, tenantId, establishmentId, productId },
      });

      if (!barcode) {
        throw new NotFoundException('Code-barres introuvable');
      }

      await manager.remove(barcode);
      await this.audit.record(
        {
          action: 'product_barcode.deleted',
          entityType: 'product_barcode',
          entityId: barcodeId,
          tenantId,
          establishmentId,
          actorId,
          oldValues: { productId, code: barcode.code },
        },
        manager,
      );
    });
  }

  // --- Interne -------------------------------------------------------------

  private async assemble(
    products: Product[],
    withPackagings: boolean,
    withBarcodes: boolean,
    withDrugDetails: boolean,
  ): Promise<ProductResponseDto[]> {
    if (products.length === 0) {
      return [];
    }

    const ids = products.map((product) => product.id);

    const [packagings, barcodes, drugs] = await Promise.all([
      withPackagings
        ? this.packagings.find({
            where: { productId: In(ids) },
            order: { isBase: 'DESC', label: 'ASC' },
          })
        : Promise.resolve([]),
      withBarcodes
        ? this.barcodes.find({ where: { productId: In(ids) } })
        : Promise.resolve([]),
      withDrugDetails
        ? this.drugDetails.find({ where: { productId: In(ids) } })
        : Promise.resolve([]),
    ]);

    const packagingsByProduct = new Map<string, ProductPackaging[]>();
    for (const packaging of packagings) {
      const list = packagingsByProduct.get(packaging.productId) ?? [];
      list.push(packaging);
      packagingsByProduct.set(packaging.productId, list);
    }

    const barcodesByProduct = new Map<string, ProductBarcode[]>();
    for (const barcode of barcodes) {
      const list = barcodesByProduct.get(barcode.productId) ?? [];
      list.push(barcode);
      barcodesByProduct.set(barcode.productId, list);
    }

    const drugByProduct = new Map(
      drugs.map((drug) => [drug.productId, drug]),
    );

    return products.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      categoryId: product.categoryId,
      baseUnit: product.baseUnit,
      reorderLevel: product.reorderLevel,
      trackingMode: product.trackingMode,
      allocationPolicy: product.allocationPolicy,
      taxRate: product.taxRate,
      isActive: product.isActive,
      packagings: (packagingsByProduct.get(product.id) ?? []).map(toPackaging),
      barcodes: (barcodesByProduct.get(product.id) ?? []).map(toBarcode),
      drugDetails: toDrugDetails(drugByProduct.get(product.id) ?? null),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  private async getOwnedProduct(
    manager: EntityManager,
    tenantId: string,
    establishmentId: string,
    productId: string,
  ): Promise<Product> {
    const product = await manager.findOne(Product, {
      where: { id: productId, tenantId, establishmentId },
    });

    if (!product) {
      throw new NotFoundException('Article introuvable');
    }

    return product;
  }

  private async assertCategory(
    tenantId: string,
    establishmentId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.categories.findOne({
      where: { id: categoryId, tenantId, establishmentId },
    });

    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }
  }

  private async assertPackagingLabel(
    manager: EntityManager,
    tenantId: string,
    establishmentId: string,
    productId: string,
    label: string,
    ignoreId?: string,
  ): Promise<void> {
    const duplicate = await manager.findOne(ProductPackaging, {
      where: { tenantId, establishmentId, productId, label },
    });

    if (duplicate && duplicate.id !== ignoreId) {
      throw new ConflictException(
        'Ce libellé de conditionnement existe déjà pour cet article',
      );
    }
  }

  private async assertBarcodesAvailable(
    tenantId: string,
    codes: string[],
  ): Promise<void> {
    if (codes.length === 0) {
      return;
    }

    const existing = await this.barcodes.find({ where: { tenantId, code: In(codes) } });

    if (existing.length > 0) {
      throw new ConflictException(
        `Code-barres déjà utilisé : ${existing.map((item) => item.code).join(', ')}`,
      );
    }
  }

  private normalizeCodes(codes: string[]): string[] {
    const normalized = codes.map((code) => code.trim()).filter(Boolean);
    return [...new Set(normalized)];
  }

  private assertTaxRate(value: string): void {
    const rate = Number(value);

    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      throw new BadRequestException(
        'taxRate doit être un pourcentage entre 0 et 100',
      );
    }
  }
}
