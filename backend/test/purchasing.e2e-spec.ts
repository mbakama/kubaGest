import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

describe('Achats, réceptions et CUMP (e2e)', () => {
  let app: INestApplication;

  const owner = {
    firstName: 'Hector',
    lastName: 'Kabeya',
    sex: 'male',
    tenantName: 'Boutique Achats',
    activityType: 'boutique',
    currency: 'usd',
    email: 'purchasing-owner@kubagest.io',
    password: 'SuperSecret123!',
  };

  let ownerToken: string;
  let productId: string;
  let warehouseId: string;
  let supplierId: string;

  const server = () => app.getHttpServer();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = configureApp(moduleFixture.createNestApplication());
    await app.init();

    const registered = await request(server())
      .post('/api/v1/auth/register')
      .send(owner)
      .expect(201);
    ownerToken = registered.body.accessToken;

    const product = await request(server())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        sku: 'CUMP-001',
        name: 'Article CUMP test',
        baseUnit: 'pièce',
        reorderLevel: 0,
        basePackaging: { label: 'Pièce', salePrice: '1000' },
      })
      .expect(201);
    productId = product.body.id;

    const warehouses = await request(server())
      .get('/api/v1/tenants/current/warehouses')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);
    const secondary = warehouses.body.find(
      (row: { kind: string }) => row.kind === 'secondary',
    );
    expect(secondary).toBeDefined();
    warehouseId = secondary.id;

    const supplier = await request(server())
      .post('/api/v1/purchasing/suppliers')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Fournisseur Test' })
      .expect(201);
    supplierId = supplier.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('valide deux réceptions et recalcule le CUMP (10×5 + 10×7 → 6)', async () => {
    const purchase = await request(server())
      .post('/api/v1/purchasing/purchases')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        supplierId,
        destinationWarehouseId: warehouseId,
        currency: 'USD',
        reference: 'PO-CUMP-001',
        items: [
          {
            physicalProductId: productId,
            quantityOrdered: 20,
            unitCost: '5.000000',
          },
        ],
      })
      .expect(201);

    expect(purchase.body.status).toBe('draft');
    expect(purchase.body.totalAmount).toBe('100.000000');

    const receiptA = await request(server())
      .post('/api/v1/purchasing/goods-receipts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        purchaseId: purchase.body.id,
        reference: 'GR-CUMP-A',
        items: [
          {
            physicalProductId: productId,
            quantityReceived: 10,
            unitCost: '5.000000',
          },
        ],
      })
      .expect(201);

    await request(server())
      .post(`/api/v1/purchasing/goods-receipts/${receiptA.body.id}/post`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201);

    const stockAfterA = await request(server())
      .get('/api/v1/stock')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);
    expect(stockAfterA.body[0]).toMatchObject({
      productId,
      quantityBase: 10,
      averageCost: '5.000000',
      totalValue: '50.000000',
    });

    const receiptB = await request(server())
      .post('/api/v1/purchasing/goods-receipts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        purchaseId: purchase.body.id,
        reference: 'GR-CUMP-B',
        items: [
          {
            physicalProductId: productId,
            quantityReceived: 10,
            unitCost: '7.000000',
          },
        ],
      })
      .expect(201);

    const posted = await request(server())
      .post(`/api/v1/purchasing/goods-receipts/${receiptB.body.id}/post`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201);

    expect(posted.body.status).toBe('posted');

    const stockFinal = await request(server())
      .get('/api/v1/stock')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(stockFinal.body[0]).toMatchObject({
      productId,
      quantityBase: 20,
      averageCost: '6.000000',
      totalValue: '120.000000',
    });

    const purchaseRefresh = await request(server())
      .post('/api/v1/purchasing/goods-receipts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        purchaseId: purchase.body.id,
        reference: 'GR-CUMP-EXTRA',
        items: [
          {
            physicalProductId: productId,
            quantityReceived: 1,
            unitCost: '1.000000',
          },
        ],
      })
      .expect(400);
    expect(purchaseRefresh.body.message).toContain('totalement réceptionnée');
  });
});
