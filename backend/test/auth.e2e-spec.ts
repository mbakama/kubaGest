import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';
import { MailService, type OutgoingMail } from './../src/mail/mail.service.js';

describe('Auth et isolation multi-tenant (e2e)', () => {
  let app: INestApplication;

  const ownerA = {
    firstName: 'Hector',
    lastName: 'Kabeya',
    sex: 'male',
    phone: '+243810000001',
    tenantName: 'Boutique Kintambo',
    activityType: 'boutique',
    email: 'owner-a@kubagest.io',
    password: 'SuperSecret123!',
  };
  const ownerB = {
    firstName: 'Amina',
    lastName: 'Ilunga',
    sex: 'female',
    tenantName: 'Pharmacie Gombe',
    activityType: 'pharmacie',
    email: 'owner-b@kubagest.io',
    password: 'SuperSecret123!',
  };
  const cashier = {
    firstName: 'Nelly',
    lastName: 'Kalonji',
    sex: 'female',
    phone: '+243810000003',
    email: 'caissier-a@kubagest.io',
    password: 'CaissierSecret123!',
    role: 'cashier',
  };

  let tenantAId: string;
  let tenantBId: string;
  let ownerAToken: string;
  let cashierToken: string;
  let cashierMembershipId: string;
  let lastMail: OutgoingMail | null = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue({
        send: async (mail: OutgoingMail) => {
          lastMail = mail;
        },
      })
      .compile();

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
      sex: ownerA.sex,
      phone: ownerA.phone,
      avatar: null,
    });
  });

  it('indique si une adresse e-mail est déjà prise', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/check-email')
      .send({ email: 'nouveau-compte@kubagest.io' })
      .expect(200)
      .expect({ available: true });

    await request(app.getHttpServer())
      .post('/api/v1/auth/check-email')
      .send({ email: ownerA.email })
      .expect(200)
      .expect({ available: false });
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
      sex: ownerA.sex,
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
      sex: ownerA.sex,
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
      .send({
        firstName: cashier.firstName,
        lastName: cashier.lastName,
        sex: cashier.sex,
        phone: cashier.phone,
        email: cashier.email,
        role: cashier.role,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      firstName: cashier.firstName,
      lastName: cashier.lastName,
      sex: 'female',
      email: cashier.email,
      role: 'cashier',
      isActive: false,
    });
    cashierMembershipId = response.body.membershipId;

    const token =
      response.body.invitationUrl?.match(/token=([^&]+)/)?.[1] ??
      lastMail?.text.match(/\/invitation\?token=([^\s]+)/)?.[1];
    expect(token).toBeTruthy();
    expect(response.body.invitationEmailSent).toBe(true);
    await request(app.getHttpServer())
      .post('/api/v1/auth/invitations/accept')
      .send({ token, password: cashier.password })
      .expect(200)
      .expect({ activated: true });
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

  it('permet à chaque collaborateur de lister et révoquer ses propres sessions', async () => {
    const listed = await request(app.getHttpServer())
      .get('/api/v1/users/me/sessions')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(Array.isArray(listed.body)).toBe(true);
    expect(listed.body.length).toBeGreaterThan(0);

    const sessionId = listed.body[0].id as string;
    await request(app.getHttpServer())
      .delete(`/api/v1/users/me/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200)
      .expect({ revoked: true });

    const ownerListed = await request(app.getHttpServer())
      .get('/api/v1/users/me/sessions')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .expect(200);
    const foreign = ownerListed.body.find(
      (row: { id: string }) => row.id === sessionId,
    );
    expect(foreign).toBeUndefined();
  });

  it('permet de changer le rôle et de gérer une dérogation auditée', async () => {
    const role = await request(app.getHttpServer())
      .patch(`/api/v1/users/${cashierMembershipId}/role`)
      .set('Authorization', `Bearer ${ownerAToken}`)
      .send({ role: 'stock_manager', reason: 'Affectation au dépôt' })
      .expect(200);
    expect(role.body.role).toBe('stock_manager');

    await request(app.getHttpServer())
      .put(`/api/v1/users/${cashierMembershipId}/permissions/stock.adjust`)
      .set('Authorization', `Bearer ${ownerAToken}`)
      .send({ allowed: true, reason: 'Inventaire mensuel' })
      .expect(200);

    const permissions = await request(app.getHttpServer())
      .get(`/api/v1/users/${cashierMembershipId}/permissions`)
      .set('Authorization', `Bearer ${ownerAToken}`)
      .expect(200);
    expect(permissions.body).toEqual([
      expect.objectContaining({
        permissionCode: 'stock.adjust',
        allowed: true,
      }),
    ]);

    const audit = await request(app.getHttpServer())
      .get('/api/v1/audit/tenant')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .expect(200);
    expect(audit.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'membership.role.updated' }),
        expect.objectContaining({ action: 'membership.permission.set' }),
      ]),
    );
  });

  it('suspend le membre et refuse de suspendre le propriétaire', async () => {
    const suspended = await request(app.getHttpServer())
      .patch(`/api/v1/users/${cashierMembershipId}/status`)
      .set('Authorization', `Bearer ${ownerAToken}`)
      .send({ isActive: false, reason: 'Fin de service' })
      .expect(200);
    expect(suspended.body.isActive).toBe(false);

    const members = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .expect(200);
    const ownerMembership = members.body.find(
      (member: { role: string }) => member.role === 'owner',
    );
    await request(app.getHttpServer())
      .patch(`/api/v1/users/${ownerMembership.membershipId}/status`)
      .set('Authorization', `Bearer ${ownerAToken}`)
      .send({ isActive: false })
      .expect(403);
  });

  it('refuse un rôle non attribuable', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${ownerAToken}`)
      .send({
        firstName: 'Autre',
        lastName: 'Propriétaire',
        sex: 'male',
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
