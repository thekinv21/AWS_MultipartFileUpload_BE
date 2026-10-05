import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MultiUploadUseCase {
  async except(files: Array<Express.Multer.File>) {
    Logger.debug('files', files);
  }
}
