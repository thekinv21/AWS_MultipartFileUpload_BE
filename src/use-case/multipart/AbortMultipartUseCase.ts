import { Injectable } from '@nestjs/common';

import { MultipartPort } from './port';
import { TAbortMultipartRequest } from './types';

@Injectable()
export class AbortMultipartUseCase {
  constructor(private readonly multipartPort: MultipartPort) {}

  async execute(input: TAbortMultipartRequest): Promise<void> {
    await this.multipartPort.abortMultipart(input);
  }
}
