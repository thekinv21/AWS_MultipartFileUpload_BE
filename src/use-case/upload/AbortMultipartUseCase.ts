import { Injectable } from '@nestjs/common';

import { TMultipartUploadTarget, UploadPort } from './port/UploadPort';

@Injectable()
export class AbortMultipartUseCase {
  constructor(private readonly uploadPort: UploadPort) {}

  async execute(input: TMultipartUploadTarget): Promise<void> {
    await this.uploadPort.abortMultipart(input);
  }
}
