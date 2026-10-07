import { TMultipartUploadTarget } from './MultipartUploadTypes';

export type TInitiateMultipartUploadRequest = {
  fileName: string;
  contentType: string;
};

export type TGetPresignedPartUrlRequest = TMultipartUploadTarget & {
  partNumber: number;
};

type TPart = { PartNumber: number; ETag: string };

export type TCompleteMultipartUploadRequest = TMultipartUploadTarget & {
  parts: TPart[];
};

export type TAbortMultipartUploadRequest = TMultipartUploadTarget;

export type TGetDownloadUrlRequest = {
  key: string;
};
