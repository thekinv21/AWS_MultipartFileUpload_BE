import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/infrastructure/database/prisma';

import { AwsModule } from './AwsModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AwsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
