import { TMultipartUploadTarget } from './MultipartUploadTypes';

export type TInitiateMultipartUploadResponse = TMultipartUploadTarget & {
  chunkSize: number;
  isPublic: boolean;
};

export type TGetPresignedPartUrlResponse = {
  url: string;
};

export type TCompleteMultipartUploadResponse = {
  key: string;
  name: string;
  extension: string;
  size: number;
  isPublic: boolean;
  url: string | null;
};

export type TGetDownloadUrlResponse = {
  url: string;
};
