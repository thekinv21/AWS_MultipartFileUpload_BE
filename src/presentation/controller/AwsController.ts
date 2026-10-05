import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';

import { MultiUploadUseCase } from '@/use-case/aws/MultiUploadUseCase';
import { SingleUploadUseCase } from '@/use-case/aws/SingleUploadUseCase';

@Controller('/aws')
export class AwsController {
  constructor(
    private readonly singleUploadUseCase: SingleUploadUseCase,
    private readonly multiUploadUseCase: MultiUploadUseCase,
  ) {}

  /**
   *
   * @param file
   * @returns
   */

  @Version('1')
  @Post('/s3-single-upload')
  @ApiOperation({
    summary: 'Upload a single file to AWS S3',
    description: 'Uploads a single file and stores it in an AWS S3 bucket.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async singleUpload(@UploadedFile() file: Express.Multer.File) {
    return this.singleUploadUseCase.except(file);
  }

  /**
   *
   * @param files
   * @returns
   */

  @Version('1')
  @Post('/s3-multi-upload')
  @ApiOperation({
    summary: 'Upload multiple files to AWS S3',
    description: 'Uploads multiple files and stores them in an AWS S3 bucket.',
  })
  @UseInterceptors(FileInterceptor('files'))
  async multiUpload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.multiUploadUseCase.except(files);
  }
}
