import {
  TCompletedPart,
  TMultipartUploadTarget,
  TUploadedPart,
} from '../types';

export abstract class MultipartPort {
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

  abstract getPresignedDownloadUrl(
    key: string,
    fileName: string,
  ): Promise<string>;

  abstract getPublicUrl(key: string): string;
}
