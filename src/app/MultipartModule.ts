import { Module } from '@nestjs/common';

import { MultipartController } from '@/presentation/controller/MultipartController';

import { AbortMultipartUploadUseCase } from '@/use-case/file/AbortMultipartUploadUseCase';
import { CompleteMultipartUploadUseCase } from '@/use-case/file/CompleteMultipartUploadUseCase';
import { GetDownloadUrlUseCase } from '@/use-case/file/GetDownloadUrlUseCase';
import { GetPresignedPartUrlUseCase } from '@/use-case/file/GetPresignedPartUrlUseCase';
import { InitiateMultipartUploadUseCase } from '@/use-case/file/InitiateMultipartUploadUseCase';

@Module({
  controllers: [MultipartController],
  providers: [
    AbortMultipartUploadUseCase,
    CompleteMultipartUploadUseCase,
    GetDownloadUrlUseCase,
    GetPresignedPartUrlUseCase,
    InitiateMultipartUploadUseCase,
  ],
})
export class MultipartModule {}
