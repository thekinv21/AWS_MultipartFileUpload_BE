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
  GetObjectCommand,
  HeadObjectCommand,
  ListPartsCommand,
  S3Client,
  S3ServiceException,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { TEnv } from '@/shared/types';

import { MultipartPort } from '@/use-case/multipart/port';
import {
  TCompletedPart,
  TMultipartUploadTarget,
  TUploadedPart,
} from '@/use-case/multipart/types';

/**
 * Client kaynaklı S3 hata kodları ve karşılık gelen HTTP hataları.
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
export class S3Service implements MultipartPort {
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
   * @description Dosya yüklemeyi başlatır
   * @param key
   * @param contentType
   * @returns UploadId
   */

  async initiateMultipart(key: string, contentType: string): Promise<string> {
    const { UploadId } = await this.run(() =>
      this.s3Client.send(
        new CreateMultipartUploadCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: contentType,
        }),
      ),
    );

    if (!UploadId) {
      throw new InternalServerErrorException(
        'S3 did not return an UploadId for the multipart upload',
      );
    }

    return UploadId;
  }

  /**
   *
   * @param param0
   * @param partNumber
   * @returns
   */

  getPresignedPartUrl(
    { key, uploadId }: TMultipartUploadTarget,
    partNumber: number,
  ): Promise<string> {
    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });

    return this.run(() =>
      getSignedUrl(this.s3Client, command, {
        expiresIn: this.presignedUrlExpiresIn,
      }),
    );
  }

  /**
   * @param TMultipartUploadTarget
   * @returns S3'e yüklenmiş tüm parçaları sayfa sayfa listeler.
   */

  async listParts({
    key,
    uploadId,
  }: TMultipartUploadTarget): Promise<TUploadedPart[]> {
    const parts: TUploadedPart[] = [];
    let partNumberMarker: string | undefined;

    do {
      const response = await this.run(() =>
        this.s3Client.send(
          new ListPartsCommand({
            Bucket: this.bucketName,
            Key: key,
            UploadId: uploadId,
            PartNumberMarker: partNumberMarker,
          }),
        ),
      );

      for (const { PartNumber, Size } of response.Parts ?? []) {
        if (PartNumber !== undefined) {
          parts.push({ partNumber: PartNumber, size: Size ?? 0 });
        }
      }

      partNumberMarker = response.IsTruncated
        ? response.NextPartNumberMarker
        : undefined;
    } while (partNumberMarker);

    return parts;
  }

  async completeMultipart(
    { key, uploadId }: TMultipartUploadTarget,
    parts: TCompletedPart[],
  ): Promise<void> {
    await this.run(() =>
      this.s3Client.send(
        new CompleteMultipartUploadCommand({
          Bucket: this.bucketName,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: parts.map(({ partNumber, etag }) => ({
              PartNumber: partNumber,
              ETag: etag,
            })),
          },
        }),
      ),
    );
  }

  async abortMultipart({
    key,
    uploadId,
  }: TMultipartUploadTarget): Promise<void> {
    await this.run(() =>
      this.s3Client.send(
        new AbortMultipartUploadCommand({
          Bucket: this.bucketName,
          Key: key,
          UploadId: uploadId,
        }),
      ),
    );
  }

  /**
   * Nesnenin varlığını doğrular, yoksa 404 döner.
   * Content-Disposition, tarayıcının dosyayı orijinal adıyla kaydetmesini sağlar.
   */

  async getPresignedDownloadUrl(
    key: string,
    fileName: string,
  ): Promise<string> {
    await this.run(() =>
      this.s3Client.send(
        new HeadObjectCommand({ Bucket: this.bucketName, Key: key }),
      ),
    );

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
