import { Injectable } from '@nestjs/common';

import { UploadPort } from './port/UploadPort';

export type TGetPresignedPartUrlRequest = {
  key: string;
  uploadId: string;
  partNumber: number;
};

export interface TGetPresignedPartUrlResponse {
  url: string;
}

@Injectable()
export class GetPresignedPartUrlUseCase {
  constructor(private readonly uploadPort: UploadPort) {}

  async execute(
    input: TGetPresignedPartUrlRequest,
  ): Promise<TGetPresignedPartUrlResponse> {
    const { key, uploadId, partNumber } = input;

    const url = await this.uploadPort.getPresignedPartUrl(
      { key, uploadId },
      partNumber,
    );

    return { url };
  }
}
