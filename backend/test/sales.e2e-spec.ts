import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

describe('Ventes, caisse et stock (e2e)', () => {
  let app: INestApplication;

  const owner = {
    firstName: 'Hector',
    lastName: 'Kabeya',
    tenantName: 'Boutique Caisse',
    activityType: 'boutique',
    currency: 'usd',
    email: 'sales-owner@kubagest.io',
    password: 'SuperSecret123!',
  };
  const cashier = {
    email: 'sales-cashier@kubagest.io',
    password: 'CaissierSecret123!',
    role: 'cashier',
  };

  let ownerToken: string;
  let cashierToken: string;
  let productId: string;
  let basePackagingId: string;
  let cartonPackagingId: string;
  let customerId: string;
  let creditId: string;

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

    await request(server())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(cashier)
      .expect(201);

    const login = await request(server())
      .post('/api/v1/auth/login')
      .send({ email: cashier.email, password: cashier.password })
      .expect(200);
    cashierToken = login.body.accessToken;

    const product = await request(server())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        sku: 'PARA-500',
        name: 'Paracétamol 500 mg',
        baseUnit: 'comprimé',
        reorderLevel: 10,
        basePackaging: { label: 'Comprimé', salePrice: '2500' },
      })
      .expect(201);

    productId = product.body.id;
    basePackagingId = product.body.packagings[0].id;

    const carton = await request(server())
      .post(`/api/v1/products/${productId}/packagings`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ label: 'Boîte de 12', factorToBase: 12, salePrice: '24000' })
      .expect(201);
    cartonPackagingId = carton.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('refuse de vendre un article sans stock', async () => {
    const response = await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        channel: 'cash',
        received: '5000',
        items: [{ productId, packagingId: basePackagingId, quantity: 2 }],
      })
      .expect(409);

    expect(response.body.message).toContain('Stock insuffisant');
  });

  it('réceptionne du stock en unité de base', async () => {
    const received = await request(server())
      .post('/api/v1/stock/entries')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ productId, quantity: 100, reference: 'Inventaire d’ouverture' })
      .expect(201);

    expect(received.body).toMatchObject({
      productId,
      quantityBase: 100,
      baseUnit: 'comprimé',
      belowThreshold: false,
    });

    const list = await request(server())
      .get('/api/v1/stock')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].quantityBase).toBe(100);
  });

  it('encaisse en espèces, sort le stock et alimente la caisse', async () => {
    const sale = await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        channel: 'cash',
        received: '6000',
        items: [{ productId, packagingId: basePackagingId, quantity: 2 }],
      })
      .expect(201);

    expect(sale.body).toMatchObject({
      number: 'T-000001',
      channel: 'cash',
      subtotal: '5000.000000',
      total: '5000.000000',
      received: '6000.000000',
      change: '1000.000000',
      registerName: 'Caisse principale',
      credit: null,
    });
    expect(sale.body.sessionId).toBeTruthy();
    expect(sale.body.items[0]).toMatchObject({
      name: 'Paracétamol 500 mg',
      quantity: 2,
      factor: 1,
      quantityBase: 2,
      unitPrice: '2500.000000',
    });

    const stock = await request(server())
      .get('/api/v1/stock')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(stock.body[0].quantityBase).toBe(98);

    const cash = await request(server())
      .get('/api/v1/cash/sessions/current')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(cash.body).toMatchObject({
      status: 'open',
      openingAmount: '0.000000',
      movementsTotal: '5000.000000',
      expectedAmount: '5000.000000',
    });
  });

  it('vend un conditionnement au prix du catalogue', async () => {
    const sale = await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        channel: 'cash',
        received: '24000',
        items: [
          {
            productId,
            packagingId: cartonPackagingId,
            quantity: 1,
          },
        ],
      })
      .expect(201);

    expect(sale.body.total).toBe('24000.000000');
    expect(sale.body.change).toBe('0.000000');

    const stock = await request(server())
      .get('/api/v1/stock')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(stock.body[0].quantityBase).toBe(86);
  });

  it('refuse un montant remis inférieur au total', async () => {
    await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        channel: 'cash',
        received: '1000',
        items: [{ productId, packagingId: basePackagingId, quantity: 1 }],
      })
      .expect(400);
  });

  it('refuse le mobile money avant son module', async () => {
    const response = await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        channel: 'mobile',
        items: [{ productId, packagingId: basePackagingId, quantity: 1 }],
      })
      .expect(400);

    expect(response.body.message).toContain('mobile money');
  });

  it('refuse de vendre au-delà du stock disponible', async () => {
    await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        channel: 'cash',
        received: '999999999',
        items: [{ productId, packagingId: basePackagingId, quantity: 9999 }],
      })
      .expect(409);
  });

  it('laisse une vente à crédit reliée au ticket et au client', async () => {
    const customer = await request(server())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ name: 'Marie Kabongo', phone: '+243810000009', creditLimit: '50000' })
      .expect(201);
    customerId = customer.body.id;

    const sale = await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        channel: 'credit',
        customerId,
        items: [{ productId, packagingId: basePackagingId, quantity: 1 }],
      })
      .expect(201);

    expect(sale.body).toMatchObject({
      number: 'T-000003',
      channel: 'credit',
      total: '2500.000000',
      received: null,
      change: null,
      customerName: 'Marie Kabongo',
    });
    expect(sale.body.credit).toMatchObject({
      number: 'CR-000001',
      remaining: '2500.000000',
    });
    creditId = sale.body.credit.id;

    const credits = await request(server())
      .get('/api/v1/credits')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(credits.body[0]).toMatchObject({
      saleId: sale.body.id,
      total: '2500.000000',
      status: 'open',
    });

    const stock = await request(server())
      .get('/api/v1/stock')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(stock.body[0].quantityBase).toBe(85);

    const cash = await request(server())
      .get('/api/v1/cash/sessions/current')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(cash.body.expectedAmount).toBe('29000.000000');
  });

  it('refuse une vente à crédit sans client', async () => {
    await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        channel: 'credit',
        items: [{ productId, packagingId: basePackagingId, quantity: 1 }],
      })
      .expect(400);
  });

  it('encaisse un règlement de crédit dans la caisse', async () => {
    await request(server())
      .post(`/api/v1/credits/${creditId}/payments`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: '1000' })
      .expect(201);

    const cash = await request(server())
      .get('/api/v1/cash/sessions/current')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(cash.body.expectedAmount).toBe('30000.000000');
  });

  it('liste les tickets du point de vente avec leurs lignes', async () => {
    const list = await request(server())
      .get('/api/v1/sales')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(list.body).toHaveLength(3);
    expect(list.body[0].items).toHaveLength(1);
    expect(list.body[0].number).toBe('T-000003');
  });

  it('clôture la session et fige le solde attendu', async () => {
    const current = await request(server())
      .get('/api/v1/cash/sessions/current')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    const closed = await request(server())
      .post(`/api/v1/cash/sessions/${current.body.id}/close`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ countedAmount: '29500', reason: 'Fin de journée' })
      .expect(201);

    expect(closed.body).toMatchObject({
      status: 'closed',
      expectedAmount: '30000.000000',
    });

    await request(server())
      .post(`/api/v1/cash/sessions/${current.body.id}/close`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({})
      .expect(409);
  });

  it('cloisonne les ventes et le stock par commerce', async () => {
    const other = await request(server())
      .post('/api/v1/auth/register')
      .send({
        ...owner,
        tenantName: 'Pharmacie Caisse',
        activityType: 'pharmacie',
        email: 'sales-other@kubagest.io',
      })
      .expect(201);

    const sales = await request(server())
      .get('/api/v1/sales')
      .set('Authorization', `Bearer ${other.body.accessToken}`)
      .expect(200);
    expect(sales.body).toHaveLength(0);

    const stock = await request(server())
      .get('/api/v1/stock')
      .set('Authorization', `Bearer ${other.body.accessToken}`)
      .expect(200);
    expect(stock.body).toHaveLength(0);

    await request(server())
      .post('/api/v1/sales')
      .set('Authorization', `Bearer ${other.body.accessToken}`)
      .send({
        channel: 'cash',
        received: '2500',
        items: [{ productId, packagingId: basePackagingId, quantity: 1 }],
      })
      .expect(404);
  });
});
