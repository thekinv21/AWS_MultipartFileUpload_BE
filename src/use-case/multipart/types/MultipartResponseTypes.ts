import { TMultipartTarget } from './MultipartTypes';

export type TInitiateMultipartResponse = TMultipartTarget & {
  chunkSize: number;
  isPublic: boolean;
};

export type TGetPresignedPartUrlResponse = {
  url: string;
};

export type TCompleteMultipartResponse = {
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
