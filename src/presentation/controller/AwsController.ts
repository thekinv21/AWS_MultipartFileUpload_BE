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

import { MultiUploadUseCase } from '@/use-case/aws/MultiUploadUseCase';
import { SingleUploadUseCase } from '@/use-case/aws/SingleUploadUseCase';

import { FileUploadDto, MultiFileUploadDto } from '../dto/aws/request';

@Controller('/aws')
export class AwsController {
  constructor(
    private readonly singleUploadUseCase: SingleUploadUseCase,
    private readonly multiUploadUseCase: MultiUploadUseCase,
  ) {}

  /**
   *
   * @description Upload a single file to AWS S3
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async singleUpload(
    @UploadedFile(new FileValidationPipe())
    file: Express.Multer.File,
  ) {
    return this.singleUploadUseCase.except(file);
  }

  /**
   *
   * @description Upload multiple files to AWS S3
   * @param files
   * @returns
   */

  @Version('1')
  @Post('/s3-multi-upload')
  @ApiOperation({
    summary: 'Upload multiple files to AWS S3',
    description: 'Uploads multiple files and stores them in an AWS S3 bucket.',
  })
  @UseInterceptors(FilesInterceptor('file', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MultiFileUploadDto,
  })
  async multiUpload(
    @UploadedFiles(new FileValidationPipe()) files: Array<Express.Multer.File>,
  ) {
    return this.multiUploadUseCase.except(files);
  }
}
