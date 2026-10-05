import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AwsModule } from './AwsModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AwsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
