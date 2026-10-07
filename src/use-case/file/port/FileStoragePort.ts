import {
  TCompletedPart,
  TMultipartUploadTarget,
  TUploadedPart,
} from '../types';

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

  abstract getContentType(key: string): Promise<string>;

  abstract deleteObject(key: string): Promise<void>;

  abstract getPublicUrl(key: string): string;
}
