import { Module } from '@nestjs/common';

import { FileController } from '@/presentation/controller/FileController';

import { AbortMultipartUploadUseCase } from '@/use-case/file/AbortMultipartUploadUseCase';
import { CompleteMultipartUploadUseCase } from '@/use-case/file/CompleteMultipartUploadUseCase';
import { GetDownloadUrlUseCase } from '@/use-case/file/GetDownloadUrlUseCase';
import { GetPresignedPartUrlUseCase } from '@/use-case/file/GetPresignedPartUrlUseCase';
import { InitiateMultipartUploadUseCase } from '@/use-case/file/InitiateMultipartUploadUseCase';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [
    AbortMultipartUploadUseCase,
    CompleteMultipartUploadUseCase,
    GetDownloadUrlUseCase,
    GetPresignedPartUrlUseCase,
    InitiateMultipartUploadUseCase,
  ],
})
export class FileModule {}
