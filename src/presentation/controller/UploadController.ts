import { Controller, Post, Version } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { MultiFileUploadUseCase } from '@/use-case/upload/MultiFileUploadUseCase';
import { SingleFileUploadUseCase } from '@/use-case/upload/SingleFileUploadUseCase';

@Controller('/upload')
export class UploadController {
  constructor(
    private readonly singleFileUploadUseCase: SingleFileUploadUseCase,
    private readonly multiFileUploadUseCase: MultiFileUploadUseCase,
  ) {}

  /**
   * @dto
   */

  @Version('1')
  @Post('/aws-s3-single-upload')
  @ApiOperation({
    summary: 'Upload a single file to AWS S3',
    description: 'Uploads a single file and stores it in an AWS S3 bucket.',
  })
  async singleUpload() {
    return this.singleFileUploadUseCase.except();
  }

  /**
   * @dto
   */

  @Version('1')
  @Post('/aws-s3-multi-upload')
  @ApiOperation({
    summary: 'Upload multiple files to AWS S3',
    description: 'Uploads multiple files and stores them in an AWS S3 bucket.',
  })
  async multiUpload() {
    return this.multiFileUploadUseCase.except();
  }
}
