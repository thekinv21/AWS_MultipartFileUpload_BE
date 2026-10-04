import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UploadModule } from './UploadModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
