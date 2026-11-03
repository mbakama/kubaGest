import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';
import { SmsService } from './../src/sms/sms.service.js';

describe('Carnet de crédit (e2e)', () => {
  let app: INestApplication;

  const sentSms: Array<{ to: string; body: string }> = [];
  const smsStub = {
    sent: sentSms,
    isConfigured: () => true,
    send: async (input: { to: string; body: string }) => {
      sentSms.push(input);
      return { sid: 'SM-test', status: 'queued', to: input.to };
    },
  };

  const owner = {
    firstName: 'Hector',
    lastName: 'Kabeya',
    tenantName: 'Boutique Crédit',
    activityType: 'boutique',
    currency: 'cdf',
    email: 'credit-owner@kubagest.io',
    password: 'SuperSecret123!',
  };
  const cashier = {
    email: 'credit-cashier@kubagest.io',
    password: 'CaissierSecret123!',
    role: 'cashier',
  };

  let ownerToken: string;
  let cashierToken: string;
  let customerId: string;
  let creditId: string;

  const server = () => app.getHttpServer();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SmsService)
      .useValue(smsStub)
      .compile();

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('enregistre un client et refuse un numéro déjà pris', async () => {
    const created = await request(server())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Marie Kabongo',
        phone: '+243810000001',
        creditLimit: '50000',
      })
      .expect(201);

    expect(created.body).toMatchObject({
      name: 'Marie Kabongo',
      creditLimit: '50000.000000',
      outstanding: '0.000000',
      available: '50000.000000',
      isActive: true,
    });
    customerId = created.body.id;

    await request(server())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Autre client', phone: '+243810000001' })
      .expect(409);
  });

  it('refuse un numéro qui n’est pas au format international', async () => {
    await request(server())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Client local', phone: '0810000000' })
      .expect(400);
  });

  it('laisse une vente à crédit et la retrouve dans le carnet', async () => {
    const created = await request(server())
      .post('/api/v1/credits')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ customerId, total: '15000' })
      .expect(201);

    expect(created.body).toMatchObject({
      customerName: 'Marie Kabongo',
      total: '15000.000000',
      paidTotal: '0.000000',
      remaining: '15000.000000',
      status: 'open',
      daysLate: null,
    });
    expect(created.body.number).toBe('CR-000001');
    creditId = created.body.id;

    const list = await request(server())
      .get('/api/v1/credits')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(list.body).toHaveLength(1);

    const customers = await request(server())
      .get('/api/v1/customers')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);
    expect(customers.body[0]).toMatchObject({
      outstanding: '15000.000000',
      available: '35000.000000',
    });
  });

  it('refuse une nouvelle vente au-delà du plafond', async () => {
    const response = await request(server())
      .post('/api/v1/credits')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ customerId, total: '40000' })
      .expect(409);

    expect(response.body.message).toContain('plafond');
  });

  it('refuse un règlement supérieur au reste dû', async () => {
    await request(server())
      .post(`/api/v1/credits/${creditId}/payments`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: '20000' })
      .expect(400);
  });

  it('encaisse un règlement partiel puis solde le crédit', async () => {
    const partial = await request(server())
      .post(`/api/v1/credits/${creditId}/payments`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: '5000' })
      .expect(201);

    expect(partial.body).toMatchObject({
      paidTotal: '5000.000000',
      remaining: '10000.000000',
      status: 'open',
    });
    expect(partial.body.payments).toHaveLength(1);

    const paid = await request(server())
      .post(`/api/v1/credits/${creditId}/payments`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: '10000', method: 'mobile' })
      .expect(201);

    expect(paid.body).toMatchObject({
      paidTotal: '15000.000000',
      remaining: '0.000000',
      status: 'paid',
    });

    await request(server())
      .post(`/api/v1/credits/${creditId}/payments`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: '1000' })
      .expect(400);
  });

  it('signale les crédits en retard et calcule le résumé', async () => {
    const late = await request(server())
      .post('/api/v1/credits')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ customerId, total: '8000', dueDate: '2026-01-01' })
      .expect(201);

    expect(late.body.daysLate).toBeGreaterThan(0);

    const open = await request(server())
      .get('/api/v1/credits?status=late')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);
    expect(open.body).toHaveLength(1);

    const summary = await request(server())
      .get('/api/v1/credits/summary')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);
    expect(summary.body).toMatchObject({
      outstanding: '8000.000000',
      openCount: 1,
      lateCount: 1,
      lateAmount: '8000.000000',
      customerCount: 1,
    });
  });

  it('interdit à un caissier d’annuler un crédit', async () => {
    await request(server())
      .post(`/api/v1/credits/${creditId}/cancel`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({})
      .expect(403);
  });

  it('relance par SMS les crédits échus, une seule fois par période', async () => {
    await request(server())
      .post('/api/v1/credits/reminders/run')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(403);

    const first = await request(server())
      .post('/api/v1/credits/reminders/run')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201);

    expect(first.body).toMatchObject({
      sent: 1,
      skipped: 0,
      failed: 0,
      candidates: 1,
      smsConfigured: true,
    });
    expect(smsStub.sent).toHaveLength(1);
    expect(smsStub.sent[0].to).toBe('+243810000001');
    expect(smsStub.sent[0].body).toContain('Boutique Crédit');
    expect(smsStub.sent[0].body).toContain('8 000 CDF');

    const history = await request(server())
      .get('/api/v1/credits/reminders')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);
    expect(history.body).toHaveLength(1);
    expect(history.body[0]).toMatchObject({ status: 'sent' });

    const second = await request(server())
      .post('/api/v1/credits/reminders/run')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201);

    expect(second.body).toMatchObject({ sent: 0, skipped: 1 });
    expect(smsStub.sent).toHaveLength(1);
  });

  it('refuse le crédit pour un client sans plafond ouvert', async () => {
    const response = await request(server())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Client comptant' })
      .expect(201);

    await request(server())
      .post('/api/v1/credits')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ customerId: response.body.id, total: '1000' })
      .expect(400);
  });

  it('cloisonne les clients par commerce', async () => {
    const other = await request(server())
      .post('/api/v1/auth/register')
      .send({
        ...owner,
        tenantName: 'Pharmacie Crédit',
        activityType: 'pharmacie',
        email: 'credit-other@kubagest.io',
      })
      .expect(201);

    const list = await request(server())
      .get('/api/v1/customers')
      .set('Authorization', `Bearer ${other.body.accessToken}`)
      .expect(200);

    expect(list.body).toHaveLength(0);
  });
});
