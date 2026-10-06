import { Injectable } from '@nestjs/common';

import { UploadPort } from './port';
import {
  TGetPresignedPartUrlRequest,
  TGetPresignedPartUrlResponse,
} from './types';

@Injectable()
export class GetPresignedPartUrlUseCase {
  constructor(private readonly uploadPort: UploadPort) {}

  async execute({
    key,
    uploadId,
    partNumber,
  }: TGetPresignedPartUrlRequest): Promise<TGetPresignedPartUrlResponse> {
    const url = await this.uploadPort.getPresignedPartUrl(
      { key, uploadId },
      partNumber,
    );

    return { url };
  }
}
