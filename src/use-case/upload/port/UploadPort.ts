import {
  TCompletedPart,
  TMultipartUploadTarget,
  TUploadedPart,
} from '../types';

/**
 * Use-case katmanının depolama sözleşmesi.
 * Infrastructure katmanı (S3Service) bu sınıfı uygular ve DI token olarak bağlar.
 */

export abstract class UploadPort {
  abstract initiateMultipart(key: string, contentType: string): Promise<string>;

  abstract getPresignedPartUrl(
    target: TMultipartUploadTarget,
    partNumber: number,
  ): Promise<string>;

  abstract listParts(target: TMultipartUploadTarget): Promise<TUploadedPart[]>;

  abstract completeMultipart(
    target: TMultipartUploadTarget,
    parts: TCompletedPart[],
  ): Promise<void>;

  abstract abortMultipart(target: TMultipartUploadTarget): Promise<void>;
}
