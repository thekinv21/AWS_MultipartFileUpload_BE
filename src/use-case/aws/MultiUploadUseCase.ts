import { Injectable } from '@nestjs/common';

@Injectable()
export class MultiUploadUseCase {
  async except(files: Array<Express.Multer.File>) {
    console.log('Files', files);
  }
}
