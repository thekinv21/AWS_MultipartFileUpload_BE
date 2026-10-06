import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from '@/app/AppModule';

import { swaggerConfig } from '@/infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction: boolean = process.env.NODE_ENV === 'production';

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

  if (!isProduction) {
    SwaggerModule.setup(
      '/docs',
      app,
      cleanupOpenApiDoc(SwaggerModule.createDocument(app, swaggerConfig)),
    );
  }

  await app.listen(process.env.PORT ?? 4200);

  if (!isProduction) {
    Logger.debug('Swagger UI running on host: http://localhost:4200/docs');
  }
}
void bootstrap();
