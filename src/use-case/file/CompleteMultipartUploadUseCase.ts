import { Injectable, PayloadTooLargeException } from '@nestjs/common';

import { MAX_FILE_SIZE_BYTES } from '@/shared/constants';

import { FileStoragePort } from './port';
import {
  TCompletedPart,
  TCompleteMultipartUploadRequest,
  TCompleteMultipartUploadResponse,
  TMultipartUploadTarget,
} from './types';

@Injectable()
export class CompleteMultipartUploadUseCase {
  constructor(private readonly fileStoragePort: FileStoragePort) {}

  async execute({
    key,
    uploadId,
    parts,
  }: TCompleteMultipartUploadRequest): Promise<TCompleteMultipartUploadResponse> {
    const target: TMultipartUploadTarget = { key, uploadId };

    const completedParts: TCompletedPart[] = parts.map((part) => ({
      partNumber: part.PartNumber,
      etag: part.ETag,
    }));

    await this.assertWithinSizeLimit(target, completedParts);

    /**
     * AWS S3 parçaların artan sırada gönderilmesini şart koşar
     */

    completedParts.sort((a, b) => a.partNumber - b.partNumber);

    await this.fileStoragePort.completeMultipartUpload(target, completedParts);

    return { key };
  }

  /**
   * Client presigned URL ile istediği boyutta part yükleyebilir.
   * Toplam boyut sınırı burada, S3'teki gerçek part boyutlarına göre uygulanır;
   * sınır aşılırsa yükleme iptal edilir.
   */

  private async assertWithinSizeLimit(
    target: TMultipartUploadTarget,
    parts: TCompletedPart[],
  ): Promise<void> {
    const uploadedSizes = new Map(
      (await this.fileStoragePort.listParts(target)).map((part) => [
        part.partNumber,
        part.size,
      ]),
    );

    const totalSize = parts.reduce(
      (total, part) => total + (uploadedSizes.get(part.partNumber) ?? 0),
      0,
    );

    if (totalSize > MAX_FILE_SIZE_BYTES) {
      await this.fileStoragePort.abortMultipartUpload(target);

      throw new PayloadTooLargeException(
        `File size must not exceed ${MAX_FILE_SIZE_BYTES} bytes`,
      );
    }
  }
}
