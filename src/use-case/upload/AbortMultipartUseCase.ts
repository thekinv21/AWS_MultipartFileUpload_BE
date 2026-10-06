import { Injectable } from '@nestjs/common';

import { UploadPort } from './port';
import { TAbortMultipartRequest } from './types';

@Injectable()
export class AbortMultipartUseCase {
  constructor(private readonly uploadPort: UploadPort) {}

  async execute(input: TAbortMultipartRequest): Promise<void> {
    await this.uploadPort.abortMultipart(input);
  }
}
