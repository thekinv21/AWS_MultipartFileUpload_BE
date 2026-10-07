import { DocumentBuilder } from '@nestjs/swagger';

export const createSwaggerConfig = (port: number) =>
  new DocumentBuilder()
    .setTitle('AWS S3 Bucket File Upload API')
    .setDescription(
      'A backend for multipart file upload service to S3 Bucket built with **NestJS** and **AWS S3** for upload files',
    )
    .setVersion('1.0')
    .setContact('Vadim', 'https://github.com/thekinv21', 'thekinv21@gmail.com')
    .addServer(`http://localhost:${port}`, 'Local Development')
    .build();
