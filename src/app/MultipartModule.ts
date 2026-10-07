import { Module } from '@nestjs/common';

import { MultipartController } from '@/presentation/controller/MultipartController';

import {
  AbortMultipartUseCase,
  CompleteMultipartUseCase,
  GetDownloadUrlUseCase,
  GetPresignedPartUrlUseCase,
  InitiateMultipartUseCase,
} from '@/use-case/multipart';

@Module({
  controllers: [MultipartController],
  providers: [
    AbortMultipartUseCase,
    CompleteMultipartUseCase,
    GetDownloadUrlUseCase,
    GetPresignedPartUrlUseCase,
    InitiateMultipartUseCase,
  ],
})
export class MultipartModule {}
