import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

import { MAX_CHUNK_SIZE } from '@/shared/constants';

import {
  AbortMultipartDto,
  CompleteMultipartDto,
  GetPresignedPartUrlDto,
  InitiateMultipartDto,
} from './dto/request';
import {
  InitiateMultipartResponseDto,
  PresignedPartUrlResponseDto,
} from './dto/response';

@Injectable()
export class S3Service {
  private readonly bucketName: string;

  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
  }

  /**
   * Multipart upload işlemini başlatır ve UploadId döndürür.
   */

  async initiateMultipartUpload(
    dto: InitiateMultipartDto,
  ): Promise<InitiateMultipartResponseDto> {
    const { fileName, contentType } = dto;
    const key = `uploads/${randomUUID()}/${fileName}`;

    const command = new CreateMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const response = await this.s3Client.send(command);

    return {
      uploadId: response.UploadId!,
      key,
      chunkSize: MAX_CHUNK_SIZE,
    };
  }

  /**
   * Belirli bir parça (part) için presigned URL üretir.
   */

  async getPresignedPartUrl(
    dto: GetPresignedPartUrlDto,
  ): Promise<PresignedPartUrlResponseDto> {
    const { key, uploadId, partNumber } = dto;

    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });

    /**
     * 1 saat geçerli presigned URL
     */

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return { url };
  }

  /**
   * Yüklenen tüm parçaları birleştirerek yüklemeyi tamamlar.
   */

  async completeMultipartUpload(dto: CompleteMultipartDto) {
    const { key, uploadId, parts } = dto;

    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        /**
         * AWS S3 parçaların sırayla gönderilmesini şart koşar
         */
        Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
      },
    });

    return await this.s3Client.send(command);
  }

  /**
   * Başarısız veya iptal edilen yükleme sürecini temizler.
   */

  async abortMultipartUpload(dto: AbortMultipartDto) {
    const { key, uploadId } = dto;

    const command = new AbortMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
    });

    return await this.s3Client.send(command);
  }
}
