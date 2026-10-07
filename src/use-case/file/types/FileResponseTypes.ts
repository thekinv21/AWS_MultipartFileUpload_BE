import { TMultipartUploadTarget } from './MultipartUploadTypes';

export type TInitiateMultipartUploadResponse = TMultipartUploadTarget & {
  chunkSize: number;
  isPublic: boolean;
};

export type TGetPresignedPartUrlResponse = {
  url: string;
};

export type TCompleteMultipartUploadResponse = {
  name: string;
  size: number;
  key: string;
  url: string | null;
  isPublic: boolean;
};

export type TGetDownloadUrlResponse = {
  url: string;
};
