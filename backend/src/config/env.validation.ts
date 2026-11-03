import { E164_PATTERN } from '../common/phone.js';

const ALLOWED_NODE_ENVS = ['development', 'test', 'production'] as const;
const ALLOWED_DB_TYPES = ['postgres', 'sqljs'] as const;
const TWILIO_ACCOUNT_SID_PATTERN = /^AC[0-9a-f]{32}$/i;
const TWILIO_MESSAGING_SERVICE_SID_PATTERN = /^MG[0-9a-f]{32}$/i;

export type NodeEnv = (typeof ALLOWED_NODE_ENVS)[number];
export type DbType = (typeof ALLOWED_DB_TYPES)[number];

export type Environment = {
  NODE_ENV: NodeEnv;
  PORT: number;
  CORS_ORIGIN: string;
  SWAGGER_ENABLED: boolean;
  DB_TYPE: DbType;  DATABASE_URL?: string;
  DB_LOCATION?: string;
  DB_SYNCHRONIZE: boolean;
  DB_LOGGING: boolean;
  CREDIT_REMINDERS_ENABLED: boolean;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  OBSERVE_APP_KEY?: string;
  OBSERVE_APP_SECRET?: string;
  OBSERVE_SERVICE_ID: string;
  PLATFORM_ADMIN_EMAIL?: string;
  PLATFORM_ADMIN_PASSWORD?: string;
  AVATAR_STORAGE_DIR: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_MESSAGING_SERVICE_SID?: string;
  TWILIO_FROM_NUMBER?: string;
  MAIL_DRIVER?: string;
  MAIL_HOST?: string;
  MAIL_PORT?: number;
  MAIL_USERNAME?: string;
  MAIL_PASSWORD?: string;
  MAIL_FROM_ADDRESS?: string;
  MAIL_FROM_NAME?: string;
  MAIL_ENCRYPTION?: string;
  APP_PUBLIC_URL?: string;
};

function readOptional(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const TRUE_VALUES = ['true', '1', 'yes', 'on'];
const FALSE_VALUES = ['false', '0', 'no', 'off'];

function readBoolean(
  config: Record<string, unknown>,
  key: string,
  fallback: boolean,
  errors: string[],
): boolean {
  const raw = readOptional(config[key]);
  if (raw === undefined) {
    return fallback;
  }

  const normalized = raw.toLowerCase();
  if (TRUE_VALUES.includes(normalized)) {
    return true;
  }
  if (FALSE_VALUES.includes(normalized)) {
    return false;
  }

  errors.push(`${key} doit valoir true ou false (reçu : "${raw}")`);
  return fallback;
}

/**
 * Valide les variables d'environnement au démarrage afin qu'une
 * configuration invalide échoue immédiatement avec un message explicite,
 * plutôt que de provoquer une erreur obscure plus tard à l'exécution.
 */
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const errors: string[] = [];

  const nodeEnv = readOptional(config.NODE_ENV) ?? 'development';
  if (!ALLOWED_NODE_ENVS.includes(nodeEnv as NodeEnv)) {
    errors.push(
      `NODE_ENV doit valoir ${ALLOWED_NODE_ENVS.join(', ')} (reçu : "${nodeEnv}")`,
    );
  }

  const rawPort = readOptional(config.PORT) ?? '3000';
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.push(
      `PORT doit être un entier entre 1 et 65535 (reçu : "${rawPort}")`,
    );
  }

  const rawDbType = readOptional(config.DB_TYPE) ?? 'postgres';
  if (!ALLOWED_DB_TYPES.includes(rawDbType as DbType)) {
    errors.push(
      `DB_TYPE doit valoir ${ALLOWED_DB_TYPES.join(', ')} (reçu : "${rawDbType}")`,
    );
  }

  const databaseUrl = readOptional(config.DATABASE_URL);
  if (rawDbType === 'postgres' && !databaseUrl) {
    errors.push('DATABASE_URL est requis lorsque DB_TYPE=postgres');
  }

  const dbSynchronize = readBoolean(config, 'DB_SYNCHRONIZE', false, errors);
  if (nodeEnv === 'production' && dbSynchronize) {
    errors.push(
      'DB_SYNCHRONIZE doit être false en production (utilisez des migrations)',
    );
  }
  if (rawDbType === 'sqljs' && !dbSynchronize) {
    errors.push(
      'DB_SYNCHRONIZE doit être true avec DB_TYPE=sqljs (les migrations sont PostgreSQL)',
    );
  }

  const jwtSecret = readOptional(config.JWT_SECRET);
  if (!jwtSecret || jwtSecret.length < 32) {
    errors.push(
      'JWT_SECRET est requis et doit contenir au moins 32 caractères',
    );
  }

  const observeAppKey = readOptional(config.OBSERVE_APP_KEY);
  const observeAppSecret = readOptional(config.OBSERVE_APP_SECRET);
  if (Boolean(observeAppKey) !== Boolean(observeAppSecret)) {
    errors.push(
      'OBSERVE_APP_KEY et OBSERVE_APP_SECRET doivent être renseignées ensemble',
    );
  }

  const swaggerEnabled = readBoolean(config, 'SWAGGER_ENABLED', true, errors);
  const dbLogging = readBoolean(config, 'DB_LOGGING', false, errors);
  // Relance automatique des crédits échus : active par défaut, sans effet
  // lorsque les identifiants SMS sont absents.
  const creditRemindersEnabled = readBoolean(
    config,
    'CREDIT_REMINDERS_ENABLED',
    true,
    errors,
  );

  // Super administrateur plateforme (§3) : optionnel, les deux ensemble.
  const platformAdminEmail = readOptional(config.PLATFORM_ADMIN_EMAIL);
  const platformAdminPassword = readOptional(config.PLATFORM_ADMIN_PASSWORD);
  if (Boolean(platformAdminEmail) !== Boolean(platformAdminPassword)) {
    errors.push(
      'PLATFORM_ADMIN_EMAIL et PLATFORM_ADMIN_PASSWORD doivent être renseignées ensemble',
    );
  }
  if (
    platformAdminEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(platformAdminEmail)
  ) {
    errors.push('PLATFORM_ADMIN_EMAIL doit être une adresse email valide');
  }
  if (platformAdminPassword && platformAdminPassword.length < 8) {
    errors.push('PLATFORM_ADMIN_PASSWORD doit contenir au moins 8 caractères');
  }

  // SMS Twilio : facultatif. Un jeton absent désactive l'envoi sans empêcher
  // le démarrage ; le format n'est contrôlé que lorsque la valeur est présente.
  const twilioAccountSid = readOptional(config.TWILIO_ACCOUNT_SID);
  const twilioAuthToken = readOptional(config.TWILIO_AUTH_TOKEN);
  const twilioMessagingServiceSid = readOptional(
    config.TWILIO_MESSAGING_SERVICE_SID,
  );
  const twilioFromNumber = readOptional(config.TWILIO_FROM_NUMBER);
  if (twilioAccountSid && !TWILIO_ACCOUNT_SID_PATTERN.test(twilioAccountSid)) {
    errors.push(
      'TWILIO_ACCOUNT_SID doit commencer par AC suivi de 32 caractères hexadécimaux',
    );
  }
  if (
    twilioMessagingServiceSid &&
    !TWILIO_MESSAGING_SERVICE_SID_PATTERN.test(twilioMessagingServiceSid)
  ) {
    errors.push(
      'TWILIO_MESSAGING_SERVICE_SID doit commencer par MG suivi de 32 caractères hexadécimaux',
    );
  }
  if (twilioAuthToken && twilioAuthToken.length < 16) {
    errors.push('TWILIO_AUTH_TOKEN doit contenir au moins 16 caractères');
  }
  if (twilioFromNumber && !E164_PATTERN.test(twilioFromNumber)) {
    errors.push(
      'TWILIO_FROM_NUMBER doit être au format international, par exemple +15005550006',
    );
  }

  // Courriel : absent, ou complet. Le port 587 avec MAIL_ENCRYPTION=ssl
  // correspond au STARTTLS d'Infomaniak, pas à une session SSL implicite.
  const mailDriver = readOptional(config.MAIL_DRIVER)?.toLowerCase();
  const mailHost = readOptional(config.MAIL_HOST);
  const mailPortRaw = readOptional(config.MAIL_PORT);
  const mailUsername = readOptional(config.MAIL_USERNAME);
  const mailPassword = readOptional(config.MAIL_PASSWORD);
  const mailFromAddress = readOptional(config.MAIL_FROM_ADDRESS);
  const mailFromName = readOptional(config.MAIL_FROM_NAME);
  const mailEncryption = readOptional(config.MAIL_ENCRYPTION)?.toLowerCase();
  const mailRequired = [
    mailDriver,
    mailHost,
    mailPortRaw,
    mailUsername,
    mailPassword,
    mailFromAddress,
  ];
  const mailStarted =
    mailRequired.some(Boolean) || Boolean(mailFromName || mailEncryption);
  let mailPort: number | undefined;
  if (mailStarted && mailRequired.some((value) => !value)) {
    errors.push(
      'MAIL_DRIVER, MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD et MAIL_FROM_ADDRESS doivent être renseignées ensemble',
    );
  }
  if (mailDriver && mailDriver !== 'smtp') {
    errors.push('MAIL_DRIVER doit valoir smtp');
  }
  if (mailEncryption && mailEncryption !== 'ssl' && mailEncryption !== 'tls') {
    errors.push('MAIL_ENCRYPTION doit valoir ssl ou tls');
  }
  if (mailPortRaw) {
    mailPort = Number(mailPortRaw);
    if (!Number.isInteger(mailPort) || mailPort < 1 || mailPort > 65535) {
      errors.push(
        `MAIL_PORT doit être un entier entre 1 et 65535 (reçu : "${mailPortRaw}")`,
      );
    }
  }
  if (mailFromAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailFromAddress)) {
    errors.push('MAIL_FROM_ADDRESS doit être une adresse email valide');
  }

  const appPublicUrl = readOptional(config.APP_PUBLIC_URL)?.replace(/\/+$/, '');
  if (appPublicUrl && !/^https?:\/\/\S+$/i.test(appPublicUrl)) {
    errors.push('APP_PUBLIC_URL doit commencer par http:// ou https://');
  }

  if (errors.length > 0) {
    throw new Error(
      `Configuration d'environnement invalide :\n- ${errors.join('\n- ')}`,
    );
  }

  const environment: Environment = {
    NODE_ENV: nodeEnv as NodeEnv,
    PORT: port,
    CORS_ORIGIN: readOptional(config.CORS_ORIGIN) ?? '*',
    SWAGGER_ENABLED: swaggerEnabled,
    DB_TYPE: rawDbType as DbType,
    DATABASE_URL: databaseUrl,
    DB_LOCATION: readOptional(config.DB_LOCATION),
    DB_SYNCHRONIZE: dbSynchronize,
    DB_LOGGING: dbLogging,
    CREDIT_REMINDERS_ENABLED: creditRemindersEnabled,
    JWT_SECRET: jwtSecret as string,
    JWT_EXPIRES_IN: readOptional(config.JWT_EXPIRES_IN) ?? '1h',
    OBSERVE_APP_KEY: observeAppKey,
    OBSERVE_APP_SECRET: observeAppSecret,
    OBSERVE_SERVICE_ID:
      readOptional(config.OBSERVE_SERVICE_ID) ?? 'kubagest-backend',
    PLATFORM_ADMIN_EMAIL: platformAdminEmail,
    PLATFORM_ADMIN_PASSWORD: platformAdminPassword,
    AVATAR_STORAGE_DIR:
      readOptional(config.AVATAR_STORAGE_DIR) ?? '.data/avatars',
    TWILIO_ACCOUNT_SID: twilioAccountSid,
    TWILIO_AUTH_TOKEN: twilioAuthToken,
    TWILIO_MESSAGING_SERVICE_SID: twilioMessagingServiceSid,
    TWILIO_FROM_NUMBER: twilioFromNumber,
    MAIL_DRIVER: mailDriver,
    MAIL_HOST: mailHost,
    MAIL_PORT: mailPort,
    MAIL_USERNAME: mailUsername,
    MAIL_PASSWORD: mailPassword,
    MAIL_FROM_ADDRESS: mailFromAddress,
    MAIL_FROM_NAME: mailFromName,
    MAIL_ENCRYPTION: mailEncryption,
    APP_PUBLIC_URL: appPublicUrl,
  };

  return environment as unknown as Record<string, unknown>;
}
