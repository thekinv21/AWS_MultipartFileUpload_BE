import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { validateEnv } from '@/shared/config';

import { PrismaModule } from '@/infrastructure/database/prisma';
import { S3Module } from '@/infrastructure/storage';

import { FileModule } from './FileModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    S3Module,
    FileModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {}
