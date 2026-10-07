import { Injectable } from '@nestjs/common';

import { FileStoragePort } from './port';
import { TAbortMultipartUploadRequest } from './types';

@Injectable()
export class AbortMultipartUploadUseCase {
  constructor(private readonly fileStoragePort: FileStoragePort) {}

  async execute(input: TAbortMultipartUploadRequest): Promise<void> {
    await this.fileStoragePort.abortMultipartUpload(input);
  }
}
