import {
  Injectable,
  InternalServerErrorException,
  PayloadTooLargeException,
} from '@nestjs/common';

import { MAX_FILE_SIZE_BYTES } from '@/shared/constants';

import { parseMultipartKey } from './MultipartKey';
import { MultipartPort } from './port';
import {
  TCompletedPart,
  TCompleteMultipartUploadRequest,
  TCompleteMultipartUploadResponse,
  TMultipartKeyInfo,
  TMultipartUploadTarget,
} from './types';

@Injectable()
export class CompleteMultipartUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute({
    key,
    uploadId,
    parts,
  }: TCompleteMultipartUploadRequest): Promise<TCompleteMultipartUploadResponse> {
    const target: TMultipartUploadTarget = { key, uploadId };

    /**
     * Key'den okunan bilgiler, geri alınamayan S3 complete'ten önce hazırlanır.
     */

    const { name, extension, isPublic } = this.parseKey(key);

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
   * DTO key biçimini zaten doğrular; buraya ulaşan geçersiz key bir programlama hatasıdır.
   */

  private parseKey(key: string): TMultipartKeyInfo {
    const keyInfo = parseMultipartKey(key);

    if (!keyInfo) {
      throw new InternalServerErrorException(`Unexpected key format: ${key}`);
    }

    return keyInfo;
  }

  /**
   * Client presigned URL ile istediği boyutta part yükleyebilir.
   * Toplam boyut sınırı burada, S3'teki gerçek part boyutlarına göre uygulanır;
   * sınır aşılırsa yükleme iptal edilir. Toplam boyutu döndürür.
   */

  private async assertWithinSizeLimit(
    target: TMultipartUploadTarget,
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
