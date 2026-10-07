import { Injectable } from '@nestjs/common';

import { FILE_KEY_PREFIX } from '@/shared/constants';

import { FileStoragePort } from './port';
import { TGetDownloadUrlRequest, TGetDownloadUrlResponse } from './types';

/**
 * Key formatı: `<prefix><uuid>-<fileName>` (bkz. InitiateMultipartUploadUseCase).
 */

const UUID_SEGMENT_LENGTH = 37;

@Injectable()
export class GetDownloadUrlUseCase {
  constructor(private readonly fileStoragePort: FileStoragePort) {}

  async execute({
    key,
  }: TGetDownloadUrlRequest): Promise<TGetDownloadUrlResponse> {
    const url = await this.fileStoragePort.getPresignedDownloadUrl(
      key,
      this.extractFileName(key),
    );

    return { url };
  }

  /**
   * İndirilen dosyanın, UUID ön eki olmadan orijinal adıyla kaydedilmesini sağlar.
   */

  private extractFileName(key: string): string {
    const name = key.slice(FILE_KEY_PREFIX.length);

    return name.slice(UUID_SEGMENT_LENGTH) || name;
  }
}
