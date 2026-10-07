import {
  TCompletedPart,
  TMultipartUploadTarget,
  TUploadedPart,
} from '../types';

/**
 * Use-case katmanının depolama sözleşmesi.
 * Infrastructure katmanı (S3Service) bu sınıfı uygular ve DI token olarak bağlar.
 */

export abstract class FileStoragePort {
  abstract initiateMultipartUpload(
    key: string,
    contentType: string,
  ): Promise<string>;

  abstract getPresignedPartUrl(
    target: TMultipartUploadTarget,
    partNumber: number,
  ): Promise<string>;

  abstract listParts(target: TMultipartUploadTarget): Promise<TUploadedPart[]>;

  abstract completeMultipartUpload(
    target: TMultipartUploadTarget,
    parts: TCompletedPart[],
  ): Promise<void>;

  abstract abortMultipartUpload(target: TMultipartUploadTarget): Promise<void>;

  abstract getPresignedDownloadUrl(
    key: string,
    fileName: string,
  ): Promise<string>;
}
