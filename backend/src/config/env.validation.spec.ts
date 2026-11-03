import { validateEnv } from './env.validation.js';

const BASE_ENV = {
  JWT_SECRET: 'a'.repeat(32),
  DATABASE_URL: 'postgresql://kubagest:kubagest@localhost:5432/kubagest',
};

describe('validateEnv', () => {
  it('applique les valeurs par défaut', () => {
    const env = validateEnv(BASE_ENV);

    expect(env).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      CORS_ORIGIN: '*',
      SWAGGER_ENABLED: true,
      DB_TYPE: 'postgres',
      DB_SYNCHRONIZE: false,
      DB_LOGGING: false,
      JWT_EXPIRES_IN: '1h',
      OBSERVE_SERVICE_ID: 'kubagest-backend',
    });
    expect(env.OBSERVE_APP_KEY).toBeUndefined();
    expect(env.OBSERVE_APP_SECRET).toBeUndefined();
  });

  it('convertit PORT en nombre et ignore les valeurs vides', () => {
    const env = validateEnv({ ...BASE_ENV, PORT: '8080', CORS_ORIGIN: '' });

    expect(env.PORT).toBe(8080);
    expect(env.CORS_ORIGIN).toBe('*');
  });

  it('accepte sqljs avec synchronisation', () => {
    const env = validateEnv({
      JWT_SECRET: 'a'.repeat(32),
      DB_TYPE: 'sqljs',
      DB_SYNCHRONIZE: 'true',
      DB_LOCATION: '.data/test.sqlite',
    });

    expect(env.DB_TYPE).toBe('sqljs');
    expect(env.DB_LOCATION).toBe('.data/test.sqlite');
  });

  it('exige la synchronisation avec sqljs', () => {
    expect(() =>
      validateEnv({ JWT_SECRET: 'a'.repeat(32), DB_TYPE: 'sqljs' }),
    ).toThrow(/DB_SYNCHRONIZE/);
  });

  it('exige DATABASE_URL avec postgres', () => {
    expect(() => validateEnv({ JWT_SECRET: 'a'.repeat(32) })).toThrow(
      /DATABASE_URL/,
    );
  });

  it('rejette un PORT invalide', () => {
    expect(() => validateEnv({ ...BASE_ENV, PORT: 'abc' })).toThrow(/PORT/);
  });

  it('rejette un NODE_ENV inconnu', () => {
    expect(() => validateEnv({ ...BASE_ENV, NODE_ENV: 'staging' })).toThrow(
      /NODE_ENV/,
    );
  });

  it('rejette un JWT_SECRET trop court', () => {
    expect(() =>
      validateEnv({ ...BASE_ENV, JWT_SECRET: 'trop-court' }),
    ).toThrow(/JWT_SECRET/);
  });

  it('rejette synchronize en production', () => {
    expect(() =>
      validateEnv({
        ...BASE_ENV,
        NODE_ENV: 'production',
        DB_SYNCHRONIZE: 'true',
      }),
    ).toThrow(/DB_SYNCHRONIZE/);
  });

  it('rejette un booléen invalide', () => {
    expect(() =>
      validateEnv({ ...BASE_ENV, SWAGGER_ENABLED: 'peut-être' }),
    ).toThrow(/SWAGGER_ENABLED/);
  });

  it('exige les deux clés Observe ensemble', () => {
    expect(() => validateEnv({ ...BASE_ENV, OBSERVE_APP_KEY: 'key' })).toThrow(
      /OBSERVE_APP_SECRET/,
    );
  });

  it('accepte Twilio absent', () => {
    const env = validateEnv(BASE_ENV);

    expect(env.TWILIO_ACCOUNT_SID).toBeUndefined();
    expect(env.TWILIO_AUTH_TOKEN).toBeUndefined();
    expect(env.TWILIO_FROM_NUMBER).toBeUndefined();
    expect(env.TWILIO_MESSAGING_SERVICE_SID).toBeUndefined();
  });

  it('accepte un service de messagerie Twilio', () => {
    const env = validateEnv({
      ...BASE_ENV,
      TWILIO_ACCOUNT_SID: `AC${'a'.repeat(32)}`,
      TWILIO_AUTH_TOKEN: 'b'.repeat(32),
      TWILIO_MESSAGING_SERVICE_SID: `MG${'c'.repeat(32)}`,
    });

    expect(env.TWILIO_MESSAGING_SERVICE_SID).toBe(`MG${'c'.repeat(32)}`);
  });

  it('accepte les trois identifiants Twilio ensemble', () => {
    const env = validateEnv({
      ...BASE_ENV,
      TWILIO_ACCOUNT_SID: `AC${'a'.repeat(32)}`,
      TWILIO_AUTH_TOKEN: 'b'.repeat(32),
      TWILIO_FROM_NUMBER: '+15005550006',
    });

    expect(env.TWILIO_FROM_NUMBER).toBe('+15005550006');
  });

  it('accepte un compte Twilio sans jeton, l’envoi reste alors désactivé', () => {
    const env = validateEnv({
      ...BASE_ENV,
      TWILIO_ACCOUNT_SID: `AC${'a'.repeat(32)}`,
      TWILIO_MESSAGING_SERVICE_SID: `MG${'c'.repeat(32)}`,
    });

    expect(env.TWILIO_AUTH_TOKEN).toBeUndefined();
  });

  it('exige la configuration mail complète', () => {
    expect(() =>
      validateEnv({ ...BASE_ENV, MAIL_HOST: 'mail.exemple.io' }),
    ).toThrow(/MAIL_PASSWORD/);
  });

  it('accepte le courriel SMTP de test', () => {
    const env = validateEnv({
      ...BASE_ENV,
      MAIL_DRIVER: 'smtp',
      MAIL_HOST: 'mail.exemple.io',
      MAIL_PORT: '587',
      MAIL_USERNAME: 'noreply@exemple.cd',
      MAIL_PASSWORD: 'secret',
      MAIL_FROM_ADDRESS: 'noreply@exemple.cd',
      MAIL_FROM_NAME: 'KubaGest',
      MAIL_ENCRYPTION: 'ssl',
    });

    expect(env.MAIL_PORT).toBe(587);
    expect(env.MAIL_ENCRYPTION).toBe('ssl');
  });

  it('rejette un numéro Twilio qui n’est pas au format international', () => {
    expect(() =>
      validateEnv({
        ...BASE_ENV,
        TWILIO_ACCOUNT_SID: `AC${'a'.repeat(32)}`,
        TWILIO_AUTH_TOKEN: 'b'.repeat(32),
        TWILIO_FROM_NUMBER: '0810000001',
      }),
    ).toThrow(/TWILIO_FROM_NUMBER/);
  });
});
