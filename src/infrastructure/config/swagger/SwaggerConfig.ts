import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Aws S3 file Upload API')
  .setDescription(
    'A backend S3 file upload service built with **NestJS** and **AWS S3** for upload files',
  )
  .setVersion('1.0')
  .setContact('Vadim', 'https://github.com/thekinv21', 'thekinv21@gmail.com')
  .addServer('http://localhost:4200', 'Local Development')
  .build();
