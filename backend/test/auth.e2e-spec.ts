import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

describe('Auth et isolation multi-tenant (e2e)', () => {
  let app: INestApplication;

  const ownerA = {
    firstName: 'Hector',
    lastName: 'Kabeya',
    phone: '+243810000001',
    tenantName: 'Boutique Kintambo',
    activityType: 'boutique',
    email: 'owner-a@kubagest.io',
    password: 'SuperSecret123!',
  };
  const ownerB = {
    firstName: 'Amina',
    lastName: 'Ilunga',
    tenantName: 'Pharmacie Gombe',
    activityType: 'pharmacie',
    email: 'owner-b@kubagest.io',
    password: 'SuperSecret123!',
  };
  const cashier = {
    email: 'caissier-a@kubagest.io',
    password: 'CaissierSecret123!',
    role: 'cashier',
  };

  let tenantAId: string;
  let tenantBId: string;
  let ownerAToken: string;
  let cashierToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = configureApp(moduleFixture.createNestApplication());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('active un établissement avec un compte propriétaire', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(ownerA)
      .expect(201);

    ownerAToken = response.body.accessToken;
    tenantAId = response.body.context.tenantId;

    expect(typeof ownerAToken).toBe('string');
    expect(response.body.context).toMatchObject({
      tenantName: ownerA.tenantName,
      activityType: 'boutique',
      role: 'owner',
    });
    expect(response.body.user).not.toHaveProperty('passwordHash');
    expect(response.body.user).toMatchObject({
      firstName: ownerA.firstName,
      lastName: ownerA.lastName,
      phone: ownerA.phone,
      avatar: null,
    });
  });

  it('active un second tenant indépendant', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(ownerB)
      .expect(201);

    tenantBId = response.body.context.tenantId;
    expect(tenantBId).not.toBe(tenantAId);
    expect(response.body.context.activityType).toBe('pharmacie');
  });

  it('refuse un email déjà utilisé', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(ownerA)
      .expect(409);
  });

  it('refuse un mot de passe incorrect', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: ownerA.email, password: 'MauvaisMotDePasse1!' })
      .expect(401);
  });

  it('refuse un tenant auquel le compte n’appartient pas', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: ownerA.email,
        password: ownerA.password,
        tenantId: tenantBId,
      })
      .expect(403);
  });

  it('connecte un propriétaire et renvoie son contexte', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: ownerA.email, password: ownerA.password })
      .expect(200);

    expect(response.body.context).toMatchObject({
      tenantId: tenantAId,
      role: 'owner',
    });
    expect(response.body.user).toMatchObject({
      firstName: ownerA.firstName,
      lastName: ownerA.lastName,
      phone: ownerA.phone,
      avatar: null,
    });
  });

  it('renvoie le profil et ses établissements', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .expect(200);

    expect(response.body.email).toBe(ownerA.email);
    expect(response.body).toMatchObject({
      firstName: ownerA.firstName,
      lastName: ownerA.lastName,
      phone: ownerA.phone,
      avatar: null,
    });
    expect(response.body.memberships).toEqual([
      expect.objectContaining({ tenantId: tenantAId, role: 'owner' }),
    ]);
  });

  it("téléverse, expose puis supprime l'avatar du compte", async () => {
    const image = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z4S8AAAAASUVORK5CYII=',
      'base64',
    );
    const uploaded = await request(app.getHttpServer())
      .post('/api/v1/users/me/avatar')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .attach('file', image, {
        filename: 'profil.png',
        contentType: 'image/png',
      })
      .expect(201);

    expect(uploaded.body.avatar).toMatch(
      new RegExp(`^/api/v1/users/${uploaded.body.id}/avatar\\?v=`),
    );
    await request(app.getHttpServer())
      .get(uploaded.body.avatar)
      .expect('Content-Type', /image\/png/)
      .expect(200);

    const removed = await request(app.getHttpServer())
      .delete('/api/v1/users/me/avatar')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .expect(200);
    expect(removed.body.avatar).toBeNull();
    await request(app.getHttpServer()).get(uploaded.body.avatar).expect(404);
  });

  it('refuse /auth/me sans jeton', async () => {
    await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });

  it('liste uniquement les utilisateurs du tenant du jeton', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .expect(200);

    const emails = response.body.map(
      (member: { email: string }) => member.email,
    );
    expect(emails).toContain(ownerA.email);
    expect(emails).not.toContain(ownerB.email);
  });

  it('permet au propriétaire de créer un caissier', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .send(cashier)
      .expect(201);

    expect(response.body).toMatchObject({
      email: cashier.email,
      role: 'cashier',
      isActive: true,
    });
  });

  it('interdit au caissier de gérer les utilisateurs', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: cashier.email, password: cashier.password })
      .expect(200);

    cashierToken = login.body.accessToken;
    expect(login.body.context.role).toBe('cashier');

    await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(403);
  });

  it('refuse un rôle non attribuable', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .send({
        email: 'autre-proprietaire@kubagest.io',
        password: 'SuperSecret123!',
        role: 'owner',
      })
      .expect(400);
  });

  it('valide le corps de la requête', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'pas-un-email', password: 'court' })
      .expect(400);
  });
});
