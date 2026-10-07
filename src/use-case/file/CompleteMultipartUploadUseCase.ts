import { Injectable } from '@nestjs/common';

import { FileStoragePort } from './port';
import {
  TCompletedPart,
  TCompleteMultipartUploadRequest,
  TMultipartUploadTarget,
} from './types';

@Injectable()
export class CompleteMultipartUploadUseCase {
  constructor(private readonly fileStoragePort: FileStoragePort) {}

  async execute({
    key,
    uploadId,
    parts,
  }: TCompleteMultipartUploadRequest): Promise<void> {
    const target: TMultipartUploadTarget = { key, uploadId };

    const completedParts: TCompletedPart[] = parts.map((part) => ({
      partNumber: part.PartNumber,
      etag: part.ETag,
    }));

    /**
     * AWS S3 parçaların artan sırada gönderilmesini şart koşar
     */

    completedParts.sort((a, b) => a.partNumber - b.partNumber);

    await this.fileStoragePort.completeMultipartUpload(target, completedParts);
  }
}
