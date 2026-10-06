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
  ListPartsCommand,
  S3Client,
  S3ServiceException,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { TEnv } from '@/shared/types';

import { UploadPort } from '@/use-case/upload/port';
import {
  TCompletedPart,
  TMultipartUploadTarget,
  TUploadedPart,
} from '@/use-case/upload/types';

/**
 * Client kaynaklı S3 hata kodları ve karşılık gelen HTTP hataları.
 */

const S3_NOT_FOUND_ERRORS = new Set(['NoSuchUpload', 'NoSuchKey']);

const S3_BAD_REQUEST_ERRORS = new Set([
  'InvalidPart',
  'InvalidPartOrder',
  'EntityTooSmall',
  'EntityTooLarge',
  'InvalidArgument',
]);

@Injectable()
export class S3Service implements UploadPort {
  private readonly logger = new Logger(S3Service.name);
  private readonly bucketName: string;
  private readonly presignedUrlExpiresIn: number;

  constructor(
    private readonly s3Client: S3Client,
    configService: ConfigService<TEnv, true>,
  ) {
    this.bucketName = configService.get('AWS_BUCKET_NAME', { infer: true });
    this.presignedUrlExpiresIn = configService.get(
      'AWS_PRESIGNED_URL_EXPIRES_IN',
      { infer: true },
    );
  }

  /**
   * Multipart upload işlemini başlatır ve UploadId döndürür.
   */

  async initiateMultipart(key: string, contentType: string): Promise<string> {
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

  async completeMultipart(
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

  async abortMultipart(target: TMultipartUploadTarget): Promise<void> {
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
   * S3 çağrısını çalıştırır, client kaynaklı S3 hatalarını uygun HTTP hatasına çevirir.
   */

  private async run<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof S3ServiceException) {
        if (S3_NOT_FOUND_ERRORS.has(error.name)) {
          throw new NotFoundException('Multipart upload not found');
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
