import { Injectable } from '@nestjs/common';

@Injectable()
export class MultiUploadUseCase {
  async except(file: Array<Express.Multer.File>) {
    console.log('Files', file);
  }
}
