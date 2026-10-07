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
  }: TInitiateMultipartUploadRequest): Promise<TInitiateMultipartUploadResponse> {
    /**
     * Dosyalar alt klasör açılmadan doğrudan prefix altına yazılır.
     * UUID ön eki, aynı isimli dosyaların birbirinin üzerine yazılmasını engeller.
     */

    const key = `${FILE_KEY_PREFIX}${randomUUID()}-${fileName}`;

    const uploadId = await this.fileStoragePort.initiateMultipartUpload(
      key,
      contentType,
    );

    return { key, uploadId, chunkSize: MAX_CHUNK_SIZE };
  }
}
