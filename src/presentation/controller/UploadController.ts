import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

import { FileValidationPipe } from '@/shared/pipes';

import {
  FileUploadRequestDto,
  MultiFileUploadRequestDto,
} from '../dto/upload/request';

@Controller('/upload')
export class UploadController {
  constructor() {}

  /**
   *
   * @description Upload a single file to AWS S3
   * @param file
   * @returns
   */

  @Version('1')
  @Post('/aws-s3-single-upload')
  @ApiOperation({
    summary: 'Upload a single file to AWS S3',
    description: 'Uploads a single file and stores it in an AWS S3 bucket.',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadRequestDto,
  })
  async singleUpload(
    @UploadedFile(new FileValidationPipe())
    file: Express.Multer.File,
  ) {
    return null;
  }

  /**
   *
   * @description Upload multiple files to AWS S3
   * @param files
   * @returns
   */

  @Version('1')
  @Post('/aws-s3-multi-upload')
  @ApiOperation({
    summary: 'Upload multiple files to AWS S3',
    description: 'Uploads multiple files and stores them in an AWS S3 bucket.',
  })
  @UseInterceptors(FilesInterceptor('file', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MultiFileUploadRequestDto,
  })
  async multiUpload(
    @UploadedFiles(new FileValidationPipe()) files: Array<Express.Multer.File>,
  ) {
    return null;
  }
}
