import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from '@/app/AppModule';

import { createSwaggerConfig } from '@/infrastructure/config';

const DEFAULT_PORT = 4200;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = Number(configService.get<string>('PORT') ?? DEFAULT_PORT);

  const isProduction: boolean =
    configService.get<string>('NODE_ENV') === 'production';

  app.use(helmet());

  app.enableCors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://localhost:3001',
    ],
  });

  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableShutdownHooks();

  if (!isProduction) {
    SwaggerModule.setup(
      '/docs',
      app,
      cleanupOpenApiDoc(
        SwaggerModule.createDocument(app, createSwaggerConfig(port)),
      ),
    );
  }

  await app.listen(port);

  if (!isProduction) {
    Logger.debug(`Swagger UI running on host: http://localhost:${port}/docs`);
  }
}
void bootstrap();
