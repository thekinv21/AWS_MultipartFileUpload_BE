export type TMultipartUploadTarget = {
  key: string;
  uploadId: string;
};

export type TCompletedPart = {
  partNumber: number;
  etag: string;
};

export type TUploadedPart = {
  partNumber: number;
  size: number;
};

export type TMultipartKeyInfo = {
  name: string;
  extension: string;
  isPublic: boolean;
};
