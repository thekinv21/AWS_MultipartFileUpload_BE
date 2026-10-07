import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListPartsCommand,
  S3Client,
  S3ServiceException,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { TEnv } from '@/shared/types';

import { FileStoragePort } from '@/use-case/file/port';
import {
  TCompletedPart,
  TMultipartUploadTarget,
  TUploadedPart,
} from '@/use-case/file/types';

/**
 * Client kaynaklı S3 hata kodları ve karşılık gelen HTTP hataları.
 */

/**
 * HeadObject gövdesiz yanıt döndüğü için hata adı `NoSuchKey` değil `NotFound` olur.
 */

const S3_NOT_FOUND_ERRORS = new Map([
  ['NoSuchUpload', 'Multipart upload not found'],
  ['NoSuchKey', 'File not found'],
  ['NotFound', 'File not found'],
]);

const S3_BAD_REQUEST_ERRORS = new Set([
  'InvalidPart',
  'InvalidPartOrder',
  'EntityTooSmall',
  'EntityTooLarge',
  'InvalidArgument',
]);

@Injectable()
export class S3Service implements FileStoragePort {
  private readonly logger = new Logger(S3Service.name);
  private readonly bucketName: string;
  private readonly presignedUrlExpiresIn: number;
  private readonly publicBaseUrl: string;

  constructor(
    private readonly s3Client: S3Client,
    configService: ConfigService<TEnv, true>,
  ) {
    this.bucketName = configService.get('AWS_BUCKET_NAME', { infer: true });
    this.presignedUrlExpiresIn = configService.get(
      'AWS_PRESIGNED_URL_EXPIRES_IN',
      { infer: true },
    );
    this.publicBaseUrl =
      configService.get('AWS_PUBLIC_BASE_URL', { infer: true }) ??
      `https://${this.bucketName}.s3.${configService.get('AWS_S3_REGION', { infer: true })}.amazonaws.com`;
  }

  /**
   * Multipart upload işlemini başlatır ve UploadId döndürür.
   */

  async initiateMultipartUpload(
    key: string,
    contentType: string,
  ): Promise<string> {
    const response = await this.run(() =>
      this.s3Client.send(
        new CreateMultipartUploadCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: contentType,
        }),
      ),
    );

    if (!response.UploadId) {
      throw new InternalServerErrorException(
        'S3 did not return an UploadId for the multipart upload',
      );
    }

    return response.UploadId;
  }

  /**
   * Belirli bir parça (part) için presigned URL üretir.
   */

  async getPresignedPartUrl(
    target: TMultipartUploadTarget,
    partNumber: number,
  ): Promise<string> {
    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: target.key,
      UploadId: target.uploadId,
      PartNumber: partNumber,
    });

    return this.run(() =>
      getSignedUrl(this.s3Client, command, {
        expiresIn: this.presignedUrlExpiresIn,
      }),
    );
  }

  /**
   * S3'e yüklenmiş tüm parçaları listeler.
   */

  async listParts(target: TMultipartUploadTarget): Promise<TUploadedPart[]> {
    const parts: TUploadedPart[] = [];
    let partNumberMarker: string | undefined;

    do {
      const response = await this.run(() =>
        this.s3Client.send(
          new ListPartsCommand({
            Bucket: this.bucketName,
            Key: target.key,
            UploadId: target.uploadId,
            PartNumberMarker: partNumberMarker,
          }),
        ),
      );

      for (const part of response.Parts ?? []) {
        if (part.PartNumber !== undefined && part.ETag !== undefined) {
          parts.push({
            partNumber: part.PartNumber,
            etag: part.ETag,
            size: part.Size ?? 0,
          });
        }
      }

      partNumberMarker = response.IsTruncated
        ? response.NextPartNumberMarker
        : undefined;
    } while (partNumberMarker);

    return parts;
  }

  /**
   * Yüklenen tüm parçaları birleştirerek yüklemeyi tamamlar.
   */

  async completeMultipartUpload(
    target: TMultipartUploadTarget,
    parts: TCompletedPart[],
  ): Promise<void> {
    await this.run(() =>
      this.s3Client.send(
        new CompleteMultipartUploadCommand({
          Bucket: this.bucketName,
          Key: target.key,
          UploadId: target.uploadId,
          MultipartUpload: {
            Parts: parts.map((part) => ({
              PartNumber: part.partNumber,
              ETag: part.etag,
            })),
          },
        }),
      ),
    );
  }

  /**
   * Başarısız veya iptal edilen yükleme sürecini temizler.
   */

  async abortMultipartUpload(target: TMultipartUploadTarget): Promise<void> {
    await this.run(() =>
      this.s3Client.send(
        new AbortMultipartUploadCommand({
          Bucket: this.bucketName,
          Key: target.key,
          UploadId: target.uploadId,
        }),
      ),
    );
  }

  /**
   * İndirme için presigned URL üretir.
   * Content-Disposition, tarayıcının dosyayı orijinal adıyla kaydetmesini sağlar.
   */

  async getPresignedDownloadUrl(
    key: string,
    fileName: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    });

    return this.run(() =>
      getSignedUrl(this.s3Client, command, {
        expiresIn: this.presignedUrlExpiresIn,
      }),
    );
  }

  /**
   * Nesnenin S3'teki içerik türünü döndürür.
   */

  async getContentType(key: string): Promise<string> {
    const response = await this.run(() =>
      this.s3Client.send(
        new HeadObjectCommand({ Bucket: this.bucketName, Key: key }),
      ),
    );

    /**
     * S3, içerik türü verilmemiş nesneler için bu değeri kullanır.
     */
    return response.ContentType ?? 'application/octet-stream';
  }

  /**
   * Nesneyi kalıcı olarak siler.
   */

  async deleteObject(key: string): Promise<void> {
    await this.run(() =>
      this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
      ),
    );
  }

  /**
   * Public klasördeki nesnenin kalıcı URL'ini üretir; key'in her parçası encode edilir.
   */

  getPublicUrl(key: string): string {
    const path = key.split('/').map(encodeURIComponent).join('/');

    return `${this.publicBaseUrl}/${path}`;
  }

  /**
   * S3 çağrısını çalıştırır, client kaynaklı S3 hatalarını uygun HTTP hatasına çevirir.
   */

  private async run<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof S3ServiceException) {
        const notFoundMessage = S3_NOT_FOUND_ERRORS.get(error.name);

        if (notFoundMessage) {
          throw new NotFoundException(notFoundMessage);
        }

        if (S3_BAD_REQUEST_ERRORS.has(error.name)) {
          throw new BadRequestException(error.message);
        }

        this.logger.error(`S3 request failed: ${error.name}`, error.stack);
      }

      throw error;
    }
  }
}
