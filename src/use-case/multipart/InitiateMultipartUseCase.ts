import { Injectable } from '@nestjs/common';

import { MAX_CHUNK_SIZE } from '@/shared/constants';

import { buildMultipartKey } from './MultipartKey';
import { MultipartPort } from './port';
import { TInitiateMultipartRequest, TInitiateMultipartResponse } from './types';

@Injectable()
export class InitiateMultipartUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute({
    fileName,
    contentType,
    isPublic,
  }: TInitiateMultipartRequest): Promise<TInitiateMultipartResponse> {
    const key = buildMultipartKey(fileName, isPublic);

    const uploadId = await this.multipartPort.initiateMultipart(
      key,
      contentType,
    );

    return { key, uploadId, chunkSize: MAX_CHUNK_SIZE, isPublic };
  }
}
