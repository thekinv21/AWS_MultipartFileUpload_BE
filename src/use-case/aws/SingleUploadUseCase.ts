import { Injectable } from '@nestjs/common';

@Injectable()
export class SingleUploadUseCase {
  async except(file: Express.Multer.File) {
    console.log('File', file);
  }
}
