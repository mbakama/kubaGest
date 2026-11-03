import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

describe('Catalogue produits (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const ownerShop = {
    firstName: 'Hector',
    lastName: 'Kabeya',
    tenantName: 'Boutique Catalogue',
    activityType: 'boutique',
    currency: 'usd',
    email: 'catalog-shop@kubagest.io',
    password: 'SuperSecret123!',
  };
  const ownerPharmacy = {
    firstName: 'Amina',
    lastName: 'Ilunga',
    tenantName: 'Pharmacie Catalogue',
    activityType: 'pharmacie',
    currency: 'cdf',
    email: 'catalog-pharmacy@kubagest.io',
    password: 'SuperSecret123!',
  };
  const cashier = {
    email: 'catalog-cashier@kubagest.io',
    password: 'CaissierSecret123!',
    role: 'cashier',
  };

  let shopToken: string;
  let pharmacyToken: string;
  let cashierToken: string;

  let categoryId: string;
  let productId: string;
  let basePackagingId: string;
  let boxPackagingId: string;

  const server = () => app.getHttpServer();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = configureApp(moduleFixture.createNestApplication());
    await app.init();
    dataSource = app.get(DataSource);

    const shop = await request(server())
      .post('/api/v1/auth/register')
      .send(ownerShop)
      .expect(201);
    shopToken = shop.body.accessToken;

    const pharmacy = await request(server())
      .post('/api/v1/auth/register')
      .send(ownerPharmacy)
      .expect(201);
    pharmacyToken = pharmacy.body.accessToken;

    await request(server())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${shopToken}`)
      .send(cashier)
      .expect(201);

    const login = await request(server())
      .post('/api/v1/auth/login')
      .send({ email: cashier.email, password: cashier.password })
      .expect(200);
    cashierToken = login.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('catégories', () => {
    it('crée une catégorie pour le commerce', async () => {
      const response = await request(server())
        .post('/api/v1/product-categories')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ name: 'Boissons' })
        .expect(201);

      expect(response.body).toMatchObject({
        name: 'Boissons',
        isActive: true,
      });
      categoryId = response.body.id;
    });

    it('refuse un nom déjà pris, sans tenir compte de la casse', async () => {
      await request(server())
        .post('/api/v1/product-categories')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ name: '  boissons  ' })
        .expect(409);
    });

    it('liste les catégories du tenant courant uniquement', async () => {
      const shop = await request(server())
        .get('/api/v1/product-categories')
        .set('Authorization', `Bearer ${shopToken}`)
        .expect(200);
      expect(shop.body).toHaveLength(1);

      const pharmacy = await request(server())
        .get('/api/v1/product-categories')
        .set('Authorization', `Bearer ${pharmacyToken}`)
        .expect(200);
      expect(pharmacy.body).toHaveLength(0);
    });

    it('interdit la création à un caissier', async () => {
      await request(server())
        .post('/api/v1/product-categories')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({ name: 'Snacks' })
        .expect(403);
    });
  });

  describe('articles', () => {
    it('crée un article avec son conditionnement de base', async () => {
      const response = await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          sku: ' coca-33 ',
          name: 'Coca-Cola 33 cl',
          baseUnit: 'bouteille',
          categoryId,
          reorderLevel: 12,
          taxRate: '16',
          basePackaging: { label: 'Pièce', salePrice: '1200.000000' },
          barcodes: ['5449000000996'],
        })
        .expect(201);

      productId = response.body.id;
      expect(response.body).toMatchObject({
        sku: 'COCA-33',
        name: 'Coca-Cola 33 cl',
        baseUnit: 'bouteille',
        reorderLevel: 12,
        trackingMode: 'none',
        allocationPolicy: 'fifo',
        isActive: true,
        categoryId,
      });
      expect(response.body.packagings).toHaveLength(1);
      expect(response.body.packagings[0]).toMatchObject({
        label: 'Pièce',
        factorToBase: 1,
        salePrice: '1200.000000',
        isBase: true,
      });
      expect(response.body.barcodes).toHaveLength(1);
      basePackagingId = response.body.packagings[0].id;
    });

    it('refuse un SKU déjà utilisé dans le commerce', async () => {
      await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          sku: 'Coca-33',
          name: 'Doublon',
          baseUnit: 'bouteille',
          basePackaging: { label: 'Pièce', salePrice: '1000' },
        })
        .expect(409);
    });

    it('refuse un code-barres déjà rattaché', async () => {
      await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          sku: 'SPRITE-33',
          name: 'Sprite 33 cl',
          baseUnit: 'bouteille',
          basePackaging: { label: 'Pièce', salePrice: '1000' },
          barcodes: ['5449000000996'],
        })
        .expect(409);
    });

    it('refuse une catégorie inexistante ou d’un autre tenant', async () => {
      await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          sku: 'ORANGE-33',
          name: 'Fanta 33 cl',
          baseUnit: 'bouteille',
          categoryId: '00000000-0000-4000-8000-000000000000',
          basePackaging: { label: 'Pièce', salePrice: '1000' },
        })
        .expect(404);
    });

    it('exige au moins un conditionnement (prix unitaire)', async () => {
      await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          sku: 'SANS-PRIX',
          name: 'Sans prix',
          baseUnit: 'pièce',
        })
        .expect(400);
    });

    it('refuse un montant négatif ou non décimal', async () => {
      await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          sku: 'NEGATIF',
          name: 'Montant négatif',
          baseUnit: 'pièce',
          basePackaging: { label: 'Pièce', salePrice: '-5' },
        })
        .expect(400);
    });

    it('recherche par nom ou SKU, insensible à la casse', async () => {
      const bySku = await request(server())
        .get('/api/v1/products')
        .query({ search: 'coca' })
        .set('Authorization', `Bearer ${shopToken}`)
        .expect(200);
      expect(bySku.body).toHaveLength(1);
      expect(bySku.body[0].id).toBe(productId);

      const byName = await request(server())
        .get('/api/v1/products')
        .query({ search: 'COLA' })
        .set('Authorization', `Bearer ${shopToken}`)
        .expect(200);
      expect(byName.body).toHaveLength(1);
    });

    it('filtre par catégorie et par état actif', async () => {
      const response = await request(server())
        .get('/api/v1/products')
        .query({ categoryId, isActive: 'true' })
        .set('Authorization', `Bearer ${shopToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].packagings).toHaveLength(1);
    });

    it('isole les articles entre commerces', async () => {
      await request(server())
        .get(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${pharmacyToken}`)
        .expect(404);
    });

    it('autorise la lecture à un caissier mais pas l’écriture', async () => {
      await request(server())
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(200);

      await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({
          sku: 'CASHIER-KO',
          name: 'Interdit',
          baseUnit: 'pièce',
          basePackaging: { label: 'Pièce', salePrice: '100' },
        })
        .expect(403);
    });

    it('met à jour un article et journalise l’action', async () => {
      const response = await request(server())
        .patch(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ reorderLevel: 24, taxRate: '0' })
        .expect(200);

      expect(response.body).toMatchObject({
        reorderLevel: 24,
        taxRate: '0.0000',
      });

      const rows = await dataSource.query(
        `SELECT action FROM audit_logs WHERE entity_id = $1`,
        [productId],
      );
      expect(rows.map((row: { action: string }) => row.action)).toContain(
        'product.updated',
      );
    });
  });

  describe('conditionnements', () => {
    it('ajoute un conditionnement multiple', async () => {
      const response = await request(server())
        .post(`/api/v1/products/${productId}/packagings`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ label: 'Boîte de 30', factorToBase: 30, salePrice: '34000' })
        .expect(201);

      boxPackagingId = response.body.id;
      expect(response.body).toMatchObject({
        label: 'Boîte de 30',
        factorToBase: 30,
        isBase: false,
        isActive: true,
      });
    });

    it('refuse un libellé déjà utilisé pour l’article', async () => {
      await request(server())
        .post(`/api/v1/products/${productId}/packagings`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ label: 'Boîte de 30', factorToBase: 12, salePrice: '9000' })
        .expect(409);
    });

    it('refuse un facteur nul', async () => {
      await request(server())
        .post(`/api/v1/products/${productId}/packagings`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ label: 'Carton', factorToBase: 0, salePrice: '9000' })
        .expect(400);
    });

    it('refuse de désactiver le conditionnement de base', async () => {
      await request(server())
        .patch(`/api/v1/products/${productId}/packagings/${basePackagingId}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ isActive: false })
        .expect(400);
    });

    it('promouvoit un conditionnement de facteur 1 en base et rétrograde l’ancienne', async () => {
      const created = await request(server())
        .post(`/api/v1/products/${productId}/packagings`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ label: 'Unité', factorToBase: 1, salePrice: '1100' })
        .expect(201);

      await request(server())
        .patch(`/api/v1/products/${productId}/packagings/${created.body.id}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ isBase: true })
        .expect(200);

      const product = await request(server())
        .get(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .expect(200);

      const bases = product.body.packagings.filter(
        (packaging: { isBase: boolean }) => packaging.isBase,
      );
      expect(bases).toHaveLength(1);
      expect(bases[0].label).toBe('Unité');
    });

    it('refuse de promouvoir un conditionnement de facteur supérieur à 1', async () => {
      await request(server())
        .patch(`/api/v1/products/${productId}/packagings/${boxPackagingId}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ isBase: true })
        .expect(400);
    });
  });

  describe('codes-barres', () => {
    it('ajoute un code-barres sur un conditionnement précis', async () => {
      const response = await request(server())
        .post(`/api/v1/products/${productId}/barcodes`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ code: '5449000001009' })
        .expect(201);

      expect(response.body.packagingId).toBeDefined();
    });

    it('accepte le même code dans un autre commerce', async () => {
      await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${pharmacyToken}`)
        .send({
          sku: 'PARA-500',
          name: 'Paracétamol 500 mg',
          baseUnit: 'comprimé',
          basePackaging: { label: 'Plaquette', salePrice: '500' },
          barcodes: ['5449000000996'],
        })
        .expect(201);
    });

    it('supprime un code-barres', async () => {
      const barcode = await request(server())
        .post(`/api/v1/products/${productId}/barcodes`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ code: '5449000001016' })
        .expect(201);

      await request(server())
        .delete(`/api/v1/products/${productId}/barcodes/${barcode.body.id}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .expect(204);

      const product = await request(server())
        .get(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .expect(200);

      expect(
        product.body.barcodes.some(
          (item: { code: string }) => item.code === '5449000001016',
        ),
      ).toBe(false);
    });
  });

  describe('règles pharmacie (F08)', () => {
    it('refuse des informations médicament hors pharmacie', async () => {
      await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          sku: 'DRUG-KO',
          name: 'Médicament en boutique',
          baseUnit: 'comprimé',
          basePackaging: { label: 'Plaquette', salePrice: '500' },
          drugDetails: {
            activeIngredient: 'Paracétamol',
            strength: '500 mg',
            dosageForm: 'Comprimé',
          },
        })
        .expect(400);
    });

    it('impose le suivi lot/péremption et la FEFO en pharmacie', async () => {
      const response = await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${pharmacyToken}`)
        .send({
          sku: 'AMOX-1G',
          name: 'Amoxicilline 1 g',
          baseUnit: 'gélule',
          basePackaging: { label: 'Boîte de 12', salePrice: '8500' },
          drugDetails: {
            activeIngredient: 'Amoxicilline',
            strength: '1 g',
            dosageForm: 'Gélule',
            prescriptionRequired: true,
          },
        })
        .expect(201);

      expect(response.body).toMatchObject({
        trackingMode: 'batch_expiry',
        allocationPolicy: 'fefo',
        drugDetails: {
          activeIngredient: 'Amoxicilline',
          prescriptionRequired: true,
        },
      });
    });

    it('refuse de retirer le suivi par lot à un médicament', async () => {
      const created = await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${pharmacyToken}`)
        .send({
          sku: 'IBU-400',
          name: 'Ibuprofène 400 mg',
          baseUnit: 'comprimé',
          basePackaging: { label: 'Boîte de 20', salePrice: '4500' },
          drugDetails: {
            activeIngredient: 'Ibuprofène',
            strength: '400 mg',
            dosageForm: 'Comprimé',
          },
        })
        .expect(201);

      await request(server())
        .patch(`/api/v1/products/${created.body.id}`)
        .set('Authorization', `Bearer ${pharmacyToken}`)
        .send({ allocationPolicy: 'fifo' })
        .expect(400);
    });

    it('autorise un article non médicamenteux sans suivi de lot', async () => {
      const response = await request(server())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${pharmacyToken}`)
        .send({
          sku: 'VIT-C',
          name: 'Vitamine C',
          baseUnit: 'comprimé',
          basePackaging: { label: 'Boîte de 30', salePrice: '3000' },
        })
        .expect(201);

      expect(response.body.trackingMode).toBe('none');
      expect(response.body.drugDetails).toBeNull();
    });
  });
});
