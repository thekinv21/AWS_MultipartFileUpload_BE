import { Module } from '@nestjs/common';

import { UploadController } from '@/presentation/controller/UploadController';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
