import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app/AppModule';

import { swaggerConfig } from '@/infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';

  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (!isProduction) {
    SwaggerModule.setup(
      '/docs',
      app,
      SwaggerModule.createDocument(app, swaggerConfig),
    );
  }

  await app.listen(process.env.PORT ?? 4200);

  if (!isProduction) {
    Logger.debug('Swagger UI running on host: http://localhost:4200/docs');
  }
}
void bootstrap();
