import { TMultipartUploadTarget } from './MultipartUploadTypes';

export type TInitiateMultipartUploadResponse = TMultipartUploadTarget & {
  chunkSize: number;
};

export type TGetPresignedPartUrlResponse = {
  url: string;
};

export type TCompleteMultipartUploadResponse = {
  key: string;
};

export type TGetDownloadUrlResponse = {
  url: string;
};
