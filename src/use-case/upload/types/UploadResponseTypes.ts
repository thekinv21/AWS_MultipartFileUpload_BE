import { TMultipartUploadTarget } from './MultipartUploadTypes';

export type TInitiateMultipartResponse = TMultipartUploadTarget & {
  chunkSize: number;
};

export type TGetPresignedPartUrlResponse = {
  url: string;
};

export type TCompleteMultipartResponse = {
  key: string;
};
