import { TMultipartTarget } from './MultipartTypes';

export type TInitiateMultipartRequest = {
  fileName: string;
  contentType: string;
  isPublic: boolean;
};

export type TGetPresignedPartUrlRequest = TMultipartTarget & {
  partNumber: number;
};

type TPart = { PartNumber: number; ETag: string };

export type TCompleteMultipartRequest = TMultipartTarget & {
  parts: TPart[];
};

export type TAbortMultipartRequest = TMultipartTarget;

export type TGetDownloadUrlRequest = {
  key: string;
};
