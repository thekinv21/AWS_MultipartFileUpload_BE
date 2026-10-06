import { TMultipartUploadTarget } from './MultipartUploadTypes';

export type TInitiateMultipartRequest = {
  fileName: string;
  contentType: string;
};

export type TGetPresignedPartUrlRequest = TMultipartUploadTarget & {
  partNumber: number;
};

type TPart = { PartNumber: number; ETag: string };

export type TCompleteMultipartRequest = TMultipartUploadTarget & {
  parts: TPart[];
};

export type TAbortMultipartRequest = TMultipartUploadTarget;
