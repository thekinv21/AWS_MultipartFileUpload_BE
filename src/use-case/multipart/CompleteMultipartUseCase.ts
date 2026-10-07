import { Injectable, PayloadTooLargeException } from '@nestjs/common';

import { MAX_FILE_SIZE_BYTES } from '@/shared/constants';

import { getMultipartKeyInfo } from './MultipartKey';
import { MultipartPort } from './port';
import {
  TCompletedPart,
  TCompleteMultipartRequest,
  TCompleteMultipartResponse,
  TMultipartTarget,
} from './types';

@Injectable()
export class CompleteMultipartUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute({
    key,
    uploadId,
    parts,
  }: TCompleteMultipartRequest): Promise<TCompleteMultipartResponse> {
    const target: TMultipartTarget = { key, uploadId };

    /**
     * Key'den okunan bilgiler, geri alınamayan S3 complete'ten önce hazırlanır.
     */

    const { name, extension, isPublic } = getMultipartKeyInfo(key);

    /**
     * AWS S3 parçaların artan sırada gönderilmesini şart koşar
     */

    const completedParts: TCompletedPart[] = parts
      .map((part) => ({ partNumber: part.PartNumber, etag: part.ETag }))
      .sort((a, b) => a.partNumber - b.partNumber);

    const size = await this.assertWithinSizeLimit(target, completedParts);

    await this.multipartPort.completeMultipart(target, completedParts);

    return {
      key,
      name,
      extension,
      size,
      isPublic,
      url: isPublic ? this.multipartPort.getPublicUrl(key) : null,
    };
  }

  /**
   * Client presigned URL ile istediği boyutta part yükleyebilir.
   * Toplam boyut sınırı burada, S3'teki gerçek part boyutlarına göre uygulanır;
   * sınır aşılırsa yükleme iptal edilir. Toplam boyutu döndürür.
   */

  private async assertWithinSizeLimit(
    target: TMultipartTarget,
    parts: TCompletedPart[],
  ): Promise<number> {
    const uploadedSizes = new Map(
      (await this.multipartPort.listParts(target)).map((part) => [
        part.partNumber,
        part.size,
      ]),
    );

    const totalSize = parts.reduce(
      (total, part) => total + (uploadedSizes.get(part.partNumber) ?? 0),
      0,
    );

    if (totalSize > MAX_FILE_SIZE_BYTES) {
      await this.multipartPort.abortMultipart(target);

      throw new PayloadTooLargeException(
        `File size must not exceed ${MAX_FILE_SIZE_BYTES} bytes`,
      );
    }

    return totalSize;
  }
}
