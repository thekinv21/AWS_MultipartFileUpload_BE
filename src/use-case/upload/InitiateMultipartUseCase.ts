import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { MAX_CHUNK_SIZE, UPLOAD_KEY_PREFIX } from '@/shared/constants';

import { UploadPort } from './port/UploadPort';

export type TInitiateMultipartRequest = {
  fileName: string;
  contentType: string;
};

export type TInitiateMultipartResponse = {
  key: string;
  uploadId: string;
  chunkSize: number;
};

@Injectable()
export class InitiateMultipartUseCase {
  constructor(private readonly uploadPort: UploadPort) {}

  async execute(
    input: TInitiateMultipartRequest,
  ): Promise<TInitiateMultipartResponse> {
    const key = `${UPLOAD_KEY_PREFIX}${randomUUID()}/${input.fileName}`;

    const uploadId = await this.uploadPort.initiateMultipart(
      key,
      input.contentType,
    );

    return { key, uploadId, chunkSize: MAX_CHUNK_SIZE };
  }
}
