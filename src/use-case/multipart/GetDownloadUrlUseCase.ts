import { Injectable } from '@nestjs/common';

import { getMultipartKeyInfo } from './MultipartKey';
import { MultipartPort } from './port';
import { TGetDownloadUrlRequest, TGetDownloadUrlResponse } from './types';

@Injectable()
export class GetDownloadUrlUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute({
    key,
  }: TGetDownloadUrlRequest): Promise<TGetDownloadUrlResponse> {
    const { name } = getMultipartKeyInfo(key);

    const url = await this.multipartPort.getPresignedDownloadUrl(key, name);

    return { url };
  }
}
