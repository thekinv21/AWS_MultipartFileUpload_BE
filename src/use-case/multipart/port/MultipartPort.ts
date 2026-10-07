import { TCompletedPart, TMultipartTarget, TUploadedPart } from '../types';

export abstract class MultipartPort {
  abstract initiateMultipart(key: string, contentType: string): Promise<string>;

  abstract getPresignedPartUrl(
    target: TMultipartTarget,
    partNumber: number,
  ): Promise<string>;

  abstract listParts(target: TMultipartTarget): Promise<TUploadedPart[]>;

  abstract completeMultipart(
    target: TMultipartTarget,
    parts: TCompletedPart[],
  ): Promise<void>;

  abstract abortMultipart(target: TMultipartTarget): Promise<void>;

  abstract getPresignedDownloadUrl(
    key: string,
    fileName: string,
  ): Promise<string>;

  abstract getPublicUrl(key: string): string;
}
