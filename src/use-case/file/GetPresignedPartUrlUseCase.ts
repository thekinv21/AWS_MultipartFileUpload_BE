import { Injectable } from '@nestjs/common';

import { FileStoragePort } from './port';
import {
  TGetPresignedPartUrlRequest,
  TGetPresignedPartUrlResponse,
} from './types';

@Injectable()
export class GetPresignedPartUrlUseCase {
  constructor(private readonly fileStoragePort: FileStoragePort) {}

  async execute({
    key,
    uploadId,
    partNumber,
  }: TGetPresignedPartUrlRequest): Promise<TGetPresignedPartUrlResponse> {
    const url = await this.fileStoragePort.getPresignedPartUrl(
      { key, uploadId },
      partNumber,
    );

    return { url };
  }
}
