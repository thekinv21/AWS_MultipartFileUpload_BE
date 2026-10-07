import { Injectable, NotFoundException } from '@nestjs/common';

import { FileRepositoryPort, FileStoragePort } from './port';
import { TGetDownloadUrlRequest, TGetDownloadUrlResponse } from './types';

@Injectable()
export class GetDownloadUrlUseCase {
  constructor(
    private readonly fileStoragePort: FileStoragePort,
    private readonly fileRepositoryPort: FileRepositoryPort,
  ) {}

  async execute({
    key,
  }: TGetDownloadUrlRequest): Promise<TGetDownloadUrlResponse> {
    const file = await this.fileRepositoryPort.findByKey(key);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const url = await this.fileStoragePort.getPresignedDownloadUrl(
      key,
      file.name,
    );

    return { url };
  }
}
