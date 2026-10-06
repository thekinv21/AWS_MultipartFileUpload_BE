import { Injectable, PayloadTooLargeException } from '@nestjs/common';

import { MAX_FILE_SIZE_BYTES } from '@/shared/constants';

import { UploadPort } from './port/UploadPort';

export type TCompleteMultipartRequest = {
  key: string;
  uploadId: string;
  parts: { PartNumber: number; ETag: string }[];
};

export type TCompleteMultipartResponse = {
  key: string;
};

@Injectable()
export class CompleteMultipartUseCase {
  constructor(private readonly uploadPort: UploadPort) {}

  async execute(
    input: TCompleteMultipartRequest,
  ): Promise<TCompleteMultipartResponse> {
    const { key, uploadId } = input;
    const target = { key, uploadId };

    /**
     * Client presigned URL ile istediği boyutta part yükleyebilir.
     * Toplam boyut sınırı burada, S3'teki gerçek part boyutlarına göre uygulanır.
     */

    const uploadedSizes = new Map(
      (await this.uploadPort.listParts(target)).map((part) => [
        part.partNumber,
        part.size,
      ]),
    );

    const totalSize = input.parts.reduce(
      (total, part) => total + (uploadedSizes.get(part.PartNumber) ?? 0),
      0,
    );

    if (totalSize > MAX_FILE_SIZE_BYTES) {
      await this.uploadPort.abortMultipart(target);

      throw new PayloadTooLargeException(
        `File size must not exceed ${MAX_FILE_SIZE_BYTES} bytes`,
      );
    }

    /**
     * AWS S3 parçaların artan sırada gönderilmesini şart koşar
     */

    const parts = input.parts
      .map((part) => ({ partNumber: part.PartNumber, etag: part.ETag }))
      .sort((a, b) => a.partNumber - b.partNumber);

    await this.uploadPort.completeMultipart(target, parts);

    return { key };
  }
}
