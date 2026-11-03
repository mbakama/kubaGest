import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/** Préfixe commun aux clients bureau et mobile (cahier des charges §9). */
export const API_PREFIX = 'api';
export const API_DEFAULT_VERSION = '1';

/**
 * Point d'entrée informatif pour un navigateur ouvert sur la racine.
 * Toutes les routes de l'application sont exposées sous `/api`, la racine ne
 * correspond donc à aucun contrôleur : sans ceci, Express répondrait
 * simplement « Cannot GET / ».
 */
function exposeRootIndex(app: INestApplication): void {
  const server = app.getHttpAdapter().getInstance() as {
    get: (path: string, handler: (req: Request, res: Response) => void) => void;
  };

  server.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'kubagest-api',
      version: API_DEFAULT_VERSION,
      description:
        'API commune aux applications de bureau (Angular/Electron) et mobile.',
      endpoints: {
        ping: `/${API_PREFIX}`,
        health: `/${API_PREFIX}/v${API_DEFAULT_VERSION}/health`,
        tenant: `/${API_PREFIX}/v${API_DEFAULT_VERSION}/tenants/current`,
        documentation: '/docs',
      },
    });
  });
}

/**
 * Configuration HTTP partagée entre le démarrage réel et les tests e2e, afin
 * que les deux exposent exactement les mêmes routes.
 */
export function configureApp(app: INestApplication): INestApplication {
  app.setGlobalPrefix(API_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_DEFAULT_VERSION,
  });

  exposeRootIndex(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Permet aux hooks de cycle de vie (onModuleDestroy, etc.) de s'exécuter.
  app.enableShutdownHooks();

  return app;
}
