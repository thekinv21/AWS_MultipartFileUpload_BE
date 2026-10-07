import { Injectable } from '@nestjs/common';

import { MultipartPort } from './port';
import { TAbortMultipartUploadRequest } from './types';

@Injectable()
export class AbortMultipartUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute(input: TAbortMultipartUploadRequest): Promise<void> {
    await this.multipartPort.abortMultipart(input);
  }
}
