import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';

import { FILE_KEY_PREFIX, MAX_FILE_SIZE_BYTES } from '@/shared/constants';

import { FileRepositoryPort, FileStoragePort } from './port';
import {
  TCompletedPart,
  TCompleteMultipartUploadRequest,
  TCompleteMultipartUploadResponse,
  TFileRecord,
  TMultipartUploadTarget,
} from './types';

const UUID_SEGMENT_LENGTH = 37;

@Injectable()
export class CompleteMultipartUploadUseCase {
  private readonly logger = new Logger(CompleteMultipartUploadUseCase.name);

  constructor(
    private readonly fileStoragePort: FileStoragePort,
    private readonly fileRepositoryPort: FileRepositoryPort,
  ) {}

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

    const size = await this.assertWithinSizeLimit(target, completedParts);

    /**
     * AWS S3 parçaların artan sırada gönderilmesini şart koşar
     */

    completedParts.sort((a, b) => a.partNumber - b.partNumber);

    await this.fileStoragePort.completeMultipartUpload(target, completedParts);

    const contentType = await this.fileStoragePort.getContentType(key);

    const isPublic = this.isPublicKey(key);

    const file = await this.saveFile({
      name: this.extractFileName(key),
      key,
      type: contentType,
      size,
      isPublic,
    });

    return {
      name: file.name,
      size: file.size,
      key: file.key,
      url: file.isPublic ? this.fileStoragePort.getPublicUrl(key) : null,
      isPublic: file.isPublic,
    };
  }

  /**
   * Kayıt yazılamazsa S3 nesnesi silinir; DB'de satırı olan her key için
   * S3'te nesne bulunması garanti altında kalır.
   */

  private async saveFile(data: TFileRecord): Promise<TFileRecord> {
    try {
      return await this.fileRepositoryPort.create(data);
    } catch (error) {
      /**
       * Aynı yükleme için eş zamanlı ikinci complete çağrısı: satır ve nesne
       * ilk çağrıya aittir, silinmez.
       */

      if (await this.fileRepositoryPort.findByKey(data.key)) {
        throw new NotFoundException('Multipart upload not found');
      }

      this.logger.error(
        `Failed to save file record for key ${data.key}`,
        error instanceof Error ? error.stack : String(error),
      );

      await this.deleteOrphanObject(data.key);

      throw new InternalServerErrorException('Failed to save the file');
    }
  }

  private async deleteOrphanObject(key: string): Promise<void> {
    try {
      await this.fileStoragePort.deleteObject(key);
    } catch (error) {
      this.logger.error(
        `Failed to delete orphan S3 object ${key}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  /**
   * Erişim türü, key'in prefix sonrası klasöründen okunur (initiate'te sunucu üretir);
   * uploadId key'e bağlı olduğu için client sonradan değiştiremez.
   */

  private isPublicKey(key: string): boolean {
    return key.startsWith(`${FILE_KEY_PREFIX}public/`);
  }

  /**
   * Orijinal dosya adı, key'in son parçasından UUID ön eki atılarak elde edilir.
   */

  private extractFileName(key: string): string {
    const name = key.slice(key.lastIndexOf('/') + 1);

    return name.slice(UUID_SEGMENT_LENGTH) || name;
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

    return totalSize;
  }
}
