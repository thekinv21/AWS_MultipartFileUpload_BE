export type TMultipartUploadTarget = {
  key: string;
  uploadId: string;
};

export type TCompletedPart = {
  partNumber: number;
  etag: string;
};

export interface TUploadedPart extends TCompletedPart {
  size: number;
}

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
