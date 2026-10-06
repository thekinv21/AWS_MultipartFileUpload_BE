import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { MAX_CHUNK_SIZE, UPLOAD_KEY_PREFIX } from '@/shared/constants';

import { UploadPort } from './port';
import { TInitiateMultipartRequest, TInitiateMultipartResponse } from './types';

@Injectable()
export class InitiateMultipartUseCase {
  constructor(private readonly uploadPort: UploadPort) {}

  async execute({
    fileName,
    contentType,
  }: TInitiateMultipartRequest): Promise<TInitiateMultipartResponse> {
    /**
     * UUID, aynı isimli dosyaların birbirinin üzerine yazılmasını engeller
     */

    const key = `${UPLOAD_KEY_PREFIX}${randomUUID()}/${fileName}`;

    const uploadId = await this.uploadPort.initiateMultipart(key, contentType);

    return { key, uploadId, chunkSize: MAX_CHUNK_SIZE };
  }
}
