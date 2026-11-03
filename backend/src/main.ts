import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module.js';
import { configureApp } from './app.setup.js';
import type { Environment } from './config/env.validation.js';

async function bootstrap() {
  // L'instrumentation Observe n'est utile que si la télémétrie est configurée.
  const observeEnabled = Boolean(
    process.env.OBSERVE_APP_KEY && process.env.OBSERVE_APP_SECRET,
  );

  const app = await NestFactory.create(AppModule, {
    instrument: observeEnabled ? ObserveInstrument : undefined,
  });
  const config = app.get<ConfigService<Environment, true>>(ConfigService);

  configureApp(app);

  const port = config.get('PORT', { infer: true });
  const corsOrigin = config.get('CORS_ORIGIN', { infer: true });

  app.enableCors({
    origin:
      corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: corsOrigin !== '*',
  });

  if (config.get('SWAGGER_ENABLED', { infer: true })) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Kubagest API')
        .setDescription(
          'API commune aux applications de bureau (Angular/Electron) et mobile. ' +
            'Toutes les routes métier sont versionnées et isolées par tenant.',
        )
        .setVersion('0.1.0')
        .addBearerAuth()
        .build(),
    );

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // 0.0.0.0 : le téléphone et l'émulateur joignent l'API par l'adresse du PC,
  // pas seulement par localhost.
  await app.listen(port, '0.0.0.0');

  console.log(`Server is running on http://0.0.0.0:${port}`);
}

await bootstrap();
