import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { ZodResponse } from 'nestjs-zod';

import { AbortMultipartUploadUseCase } from '@/use-case/file/AbortMultipartUploadUseCase';
import { CompleteMultipartUploadUseCase } from '@/use-case/file/CompleteMultipartUploadUseCase';
import { GetDownloadUrlUseCase } from '@/use-case/file/GetDownloadUrlUseCase';
import { GetPresignedPartUrlUseCase } from '@/use-case/file/GetPresignedPartUrlUseCase';
import { InitiateMultipartUploadUseCase } from '@/use-case/file/InitiateMultipartUploadUseCase';

import {
  AbortMultipartUploadRequestDto,
  CompleteMultipartUploadRequestDto,
  GetDownloadUrlRequestDto,
  GetPresignedPartUrlRequestDto,
  InitiateMultipartUploadRequestDto,
} from '../dto/multipart/request';
import {
  GetDownloadUrlResponseDto,
  GetPresignedPartUrlResponseDto,
  InitiateMultipartUploadResponseDto,
} from '../dto/multipart/response';

@Controller({ path: '/files', version: '1' })
export class MultipartController {
  constructor(
    private readonly initiateMultipartUploadUseCase: InitiateMultipartUploadUseCase,
    private readonly getPresignedPartUrlUseCase: GetPresignedPartUrlUseCase,
    private readonly completeMultipartUploadUseCase: CompleteMultipartUploadUseCase,
    private readonly abortMultipartUploadUseCase: AbortMultipartUploadUseCase,
    private readonly getDownloadUrlUseCase: GetDownloadUrlUseCase,
  ) {}

  @Post('/multipart')
  @ApiOperation({
    summary: 'Initiate a multipart upload',
    description:
      'Initiates a multipart upload session for a file and returns the upload ID required for uploading its parts.',
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    description: 'Multipart upload session created',
    type: InitiateMultipartUploadResponseDto,
  })
  async initiateMultipartUpload(
    @Body() dto: InitiateMultipartUploadRequestDto,
  ) {
    return this.initiateMultipartUploadUseCase.execute(dto);
  }

  @Post('/multipart/part-url')
  @ApiOperation({
    summary: 'Generate a presigned URL for a multipart upload part',
    description:
      'Generates a presigned URL that allows a specific part of a file to be uploaded directly to an AWS S3 bucket.',
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    description: 'Presigned URL for the requested part',
    type: GetPresignedPartUrlResponseDto,
  })
  async getPresignedPartUrl(@Body() dto: GetPresignedPartUrlRequestDto) {
    return this.getPresignedPartUrlUseCase.execute(dto);
  }

  @Post('/multipart/complete')
  @ApiOperation({
    summary: 'Complete a multipart upload',
    description:
      'Completes a multipart upload by combining all uploaded parts into the final file stored in the AWS S3 bucket.',
  })
  async completeMultipartUpload(
    @Body() dto: CompleteMultipartUploadRequestDto,
  ) {
    return this.completeMultipartUploadUseCase.execute(dto);
  }

  @Post('/multipart/abort')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Abort a multipart upload',
    description:
      'Aborts an active multipart upload and discards all uploaded parts associated with the upload.',
  })
  async abortMultipartUpload(
    @Body() dto: AbortMultipartUploadRequestDto,
  ): Promise<void> {
    await this.abortMultipartUploadUseCase.execute(dto);
  }

  @Get('/download-url')
  @ApiOperation({
    summary: 'Generate a presigned download URL',
    description:
      'Generates a presigned URL that allows a stored file to be downloaded directly from the AWS S3 bucket.',
  })
  @ZodResponse({
    status: HttpStatus.OK,
    description: 'Presigned URL for downloading the file',
    type: GetDownloadUrlResponseDto,
  })
  async getDownloadUrl(@Query() dto: GetDownloadUrlRequestDto) {
    return this.getDownloadUrlUseCase.execute(dto);
  }
}
