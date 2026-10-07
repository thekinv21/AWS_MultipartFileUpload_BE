import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { FILE_KEY_PREFIX, MAX_CHUNK_SIZE } from '@/shared/constants';

import { FileStoragePort } from './port';
import {
  TInitiateMultipartUploadRequest,
  TInitiateMultipartUploadResponse,
} from './types';

@Injectable()
export class InitiateMultipartUploadUseCase {
  constructor(private readonly fileStoragePort: FileStoragePort) {}

  async execute({
    fileName,
    contentType,
    isPublic,
  }: TInitiateMultipartUploadRequest): Promise<TInitiateMultipartUploadResponse> {
    const folder = isPublic ? 'public' : 'private';
    const key = `${FILE_KEY_PREFIX}${folder}/${randomUUID()}-${fileName}`;

    const uploadId = await this.fileStoragePort.initiateMultipartUpload(
      key,
      contentType,
    );

    return { key, uploadId, chunkSize: MAX_CHUNK_SIZE, isPublic };
  }
}
