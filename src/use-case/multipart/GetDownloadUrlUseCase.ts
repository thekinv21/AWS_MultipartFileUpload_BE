import { Injectable, NotFoundException } from '@nestjs/common';

import { parseMultipartKey } from './MultipartKey';
import { MultipartPort } from './port';
import { TGetDownloadUrlRequest, TGetDownloadUrlResponse } from './types';

@Injectable()
export class GetDownloadUrlUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute({
    key,
  }: TGetDownloadUrlRequest): Promise<TGetDownloadUrlResponse> {
    const keyInfo = parseMultipartKey(key);

    if (!keyInfo) {
      throw new NotFoundException('File not found');
    }

    const url = await this.multipartPort.getPresignedDownloadUrl(
      key,
      keyInfo.name,
    );

    return { url };
  }
}
