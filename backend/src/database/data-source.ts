import 'dotenv/config';
import { DataSource } from 'typeorm';
import { APP_MIGRATIONS } from './migrations.registry.js';

/**
 * Source de données utilisée par la CLI TypeORM (migrations exécutées à la
 * main, hors application). L'application, elle, construit sa connexion via
 * `buildTypeOrmOptions` avec ConfigService.
 *
 * Usage : `npm run migration:run` (compile puis applique les migrations).
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  migrations: APP_MIGRATIONS,
  migrationsTableName: 'migrations',
});
