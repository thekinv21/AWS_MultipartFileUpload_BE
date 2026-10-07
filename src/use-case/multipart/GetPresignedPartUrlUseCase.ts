import { Injectable } from '@nestjs/common';

import { MultipartPort } from './port';
import {
  TGetPresignedPartUrlRequest,
  TGetPresignedPartUrlResponse,
} from './types';

@Injectable()
export class GetPresignedPartUrlUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute({
    key,
    uploadId,
    partNumber,
  }: TGetPresignedPartUrlRequest): Promise<TGetPresignedPartUrlResponse> {
    const url = await this.multipartPort.getPresignedPartUrl(
      { key, uploadId },
      partNumber,
    );

    return { url };
  }
}
