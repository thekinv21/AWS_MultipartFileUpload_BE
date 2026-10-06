import { Module } from '@nestjs/common';

import { UploadController } from '@/presentation/controller/UploadController';

import { AbortMultipartUseCase } from '@/use-case/upload/AbortMultipartUseCase';
import { CompleteMultipartUseCase } from '@/use-case/upload/CompleteMultipartUseCase';
import { GetPresignedPartUrlUseCase } from '@/use-case/upload/GetPresignedPartUrlUseCase';
import { InitiateMultipartUseCase } from '@/use-case/upload/InitiateMultipartUseCase';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [
    AbortMultipartUseCase,
    CompleteMultipartUseCase,
    GetPresignedPartUrlUseCase,
    InitiateMultipartUseCase,
  ],
})
export class UploadModule {}
