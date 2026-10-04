import { Module } from '@nestjs/common';

import { UploadController } from '@/presentation/controller/UploadController';

import { MultiFileUploadUseCase } from '@/use-case/upload/MultiFileUploadUseCase';
import { SingleFileUploadUseCase } from '@/use-case/upload/SingleFileUploadUseCase';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [SingleFileUploadUseCase, MultiFileUploadUseCase],
})
export class UploadModule {}
