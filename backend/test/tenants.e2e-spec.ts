import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';
import { hashPassword } from './../src/common/password.js';
import { User } from './../src/users/user.entity.js';

describe('Tenants et abonnements (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const ownerA = {
    firstName: 'Hector',
    lastName: 'Kabeya',
    tenantName: 'Boutique Kintambo',
    activityType: 'boutique',
    currency: 'usd',
    address: '12, avenue de la Libération',
    email: 'tenant-a@kubagest.io',
    password: 'SuperSecret123!',
  };
  const ownerB = {
    firstName: 'Amina',
    lastName: 'Ilunga',
    tenantName: 'Pharmacie Gombe',
    activityType: 'pharmacie',
    email: 'tenant-b@kubagest.io',
    password: 'SuperSecret123!',
  };
  const platformAdmin = {
    email: 'platform-admin@kubagest.io',
    password: 'PlateformeSecret123!',
  };
  const cashier = {
    email: 'tenant-cashier@kubagest.io',
    password: 'CaissierSecret123!',
    role: 'cashier',
  };

  let tenantAId: string;
  let tenantBId: string;
  let tokenA: string;
  let tokenB: string;
  let platformToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = configureApp(moduleFixture.createNestApplication());
    await app.init();
    dataSource = app.get(DataSource);

    const registerA = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(ownerA)
      .expect(201);
    tokenA = registerA.body.accessToken;
    tenantAId = registerA.body.context.tenantId;

    const registerB = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(ownerB)
      .expect(201);
    tokenB = registerB.body.accessToken;
    tenantBId = registerB.body.context.tenantId;

    // Super administrateur plateforme sans rattachement tenant (§3).
    await dataSource.getRepository(User).save(
      dataSource.getRepository(User).create({
        email: platformAdmin.email,
        passwordHash: await hashPassword(platformAdmin.password),
        isPlatformAdmin: true,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('expose devise, adresse et abonnement du tenant courant', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/tenants/current')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: tenantAId,
      name: ownerA.tenantName,
      currency: 'USD',
      address: ownerA.address,
      status: 'trial',
      plan: 'essential',
    });
    expect(response.body.establishments).toHaveLength(1);
    expect(response.body.establishments[0]).toMatchObject({
      name: ownerA.tenantName,
      activityType: 'boutique',
    });
    expect(response.body.subscription).toMatchObject({
      plan: 'essential',
      status: 'trial',
    });
    // Essai de 30 jours accordé à l'activation (F07).
    const trialEnd = new Date(response.body.subscription.endAt);
    const remainingDays = Math.round(
      (trialEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
    );
    expect(remainingDays).toBeGreaterThanOrEqual(29);
    expect(remainingDays).toBeLessThanOrEqual(30);
  });

  it('renvoie aussi la devise dans le contexte de connexion', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Jean',
        lastName: 'Mukendi',
        tenantName: 'Alimentation Matete',
        activityType: 'alimentation',
        currency: 'cdf',
        email: 'tenant-c@kubagest.io',
        password: 'SuperSecret123!',
      })
      .expect(201);

    expect(response.body.context.currency).toBe('CDF');
  });

  it('permet au propriétaire de modifier le profil du tenant', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/v1/tenants/current')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'Boutique Kintambo Centre',
        currency: 'cdf',
        address: '  ',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      name: 'Boutique Kintambo Centre',
      currency: 'CDF',
      address: null,
    });
  });

  it('audite la modification du profil', async () => {
    const rows = await dataSource.query(
      `SELECT action FROM audit_logs WHERE entity_id = $1`,
      [tenantAId],
    );
    const actions = rows.map((row: { action: string }) => row.action);

    expect(actions).toContain('tenant.updated');
  });

  it('refuse une devise non ISO 4217', async () => {
    await request(app.getHttpServer())
      .patch('/api/v1/tenants/current')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ currency: 'franc' })
      .expect(400);
  });

  it('refuse une requête sans aucune modification', async () => {
    await request(app.getHttpServer())
      .patch('/api/v1/tenants/current')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({})
      .expect(400);
  });

  it('interdit la modification du profil à un caissier', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(cashier)
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: cashier.email, password: cashier.password })
      .expect(200);

    await request(app.getHttpServer())
      .patch('/api/v1/tenants/current')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({ currency: 'USD' })
      .expect(403);
  });

  it('isole les tenants : chacun ne voit que son profil', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/tenants/current')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    expect(response.body.id).not.toBe(tenantAId);
    expect(response.body.name).toBe(ownerB.tenantName);
  });

  it('refuse la gestion plateforme à un propriétaire', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/platform/tenants')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(403);
  });

  it('refuse un jeton plateforme sur les routes métier', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ ...platformAdmin, platform: true })
      .expect(200);

    platformToken = login.body.accessToken;
    expect(login.body.context).toBeNull();

    await request(app.getHttpServer())
      .get('/api/v1/tenants/current')
      .set('Authorization', `Bearer ${platformToken}`)
      .expect(403);
  });

  it('liste les tenants pour le super administrateur', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/platform/tenants')
      .set('Authorization', `Bearer ${platformToken}`)
      .expect(200);

    const ids = response.body.map((tenant: { id: string }) => tenant.id);
    expect(ids).toContain(tenantAId);
    expect(response.body[0]).toHaveProperty('subscription');
  });

  it('paramètre la formule, le statut et l’échéance d’un tenant', async () => {
    const endAt = '2027-12-31T23:59:59.000Z';
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/platform/tenants/${tenantAId}/subscription`)
      .set('Authorization', `Bearer ${platformToken}`)
      .send({ plan: 'control', status: 'active', endAt })
      .expect(200);

    expect(response.body).toMatchObject({
      id: tenantAId,
      plan: 'control',
      status: 'active',
    });
    expect(response.body.subscription).toMatchObject({
      plan: 'control',
      status: 'active',
      endAt,
    });

    const current = await request(app.getHttpServer())
      .get('/api/v1/tenants/current')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(current.body).toMatchObject({ status: 'active', plan: 'control' });
  });

  it('refuse une échéance qui n’est pas une date ISO', async () => {
    await request(app.getHttpServer())
      .patch(`/api/v1/platform/tenants/${tenantAId}/subscription`)
      .set('Authorization', `Bearer ${platformToken}`)
      .send({ endAt: 'demain' })
      .expect(400);
  });

  it('refuse un tenant inconnu', async () => {
    await request(app.getHttpServer())
      .patch(
        '/api/v1/platform/tenants/00000000-0000-4000-8000-000000000000/subscription',
      )
      .set('Authorization', `Bearer ${platformToken}`)
      .send({ status: 'suspended' })
      .expect(404);
  });

  describe('suspension', () => {
    it('bloque la connexion d’un tenant suspendu', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/platform/tenants/${tenantBId}/subscription`)
        .set('Authorization', `Bearer ${platformToken}`)
        .send({ status: 'suspended' })
        .expect(200);

      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: ownerB.email, password: ownerB.password })
        .expect(403);
    });

    it('rejette le jeton déjà émis par un tenant suspendu', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/tenants/current')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(403);

      await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(403);
    });

    it('reste gérable par la plateforme', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/platform/tenants')
        .set('Authorization', `Bearer ${platformToken}`)
        .expect(200);

      const suspended = response.body.find(
        (tenant: { id: string }) => tenant.id === tenantBId,
      );
      expect(suspended.status).toBe('suspended');
    });

    it('rétablit l’accès après réactivation', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/platform/tenants/${tenantBId}/subscription`)
        .set('Authorization', `Bearer ${platformToken}`)
        .send({ status: 'active' })
        .expect(200);

      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: ownerB.email, password: ownerB.password })
        .expect(200);

      await request(app.getHttpServer())
        .get('/api/v1/tenants/current')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);
    });
  });
});
