import { Injectable } from '@nestjs/common';

import { MAX_CHUNK_SIZE } from '@/shared/constants';

import { buildMultipartKey } from './MultipartKey';
import { MultipartPort } from './port';
import {
  TInitiateMultipartUploadRequest,
  TInitiateMultipartUploadResponse,
} from './types';

@Injectable()
export class InitiateMultipartUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute({
    fileName,
    contentType,
    isPublic,
  }: TInitiateMultipartUploadRequest): Promise<TInitiateMultipartUploadResponse> {
    const key = buildMultipartKey(fileName, isPublic);

    const uploadId = await this.multipartPort.initiateMultipart(
      key,
      contentType,
    );

    return { key, uploadId, chunkSize: MAX_CHUNK_SIZE, isPublic };
  }
}
