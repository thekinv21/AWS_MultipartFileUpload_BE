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

import {
  AbortMultipartUseCase,
  CompleteMultipartUseCase,
  GetDownloadUrlUseCase,
  GetPresignedPartUrlUseCase,
  InitiateMultipartUseCase,
} from '@/use-case/multipart';

import {
  AbortMultipartRequestDto,
  CompleteMultipartRequestDto,
  GetDownloadUrlRequestDto,
  GetPresignedPartUrlRequestDto,
  InitiateMultipartRequestDto,
} from '../dto/multipart/request';
import {
  CompleteMultipartResponseDto,
  GetDownloadUrlResponseDto,
  GetPresignedPartUrlResponseDto,
  InitiateMultipartResponseDto,
} from '../dto/multipart/response';

@Controller({ path: '/multipart', version: '1' })
export class MultipartController {
  constructor(
    private readonly initiateMultipartUseCase: InitiateMultipartUseCase,
    private readonly getPresignedPartUrlUseCase: GetPresignedPartUrlUseCase,
    private readonly completeMultipartUseCase: CompleteMultipartUseCase,
    private readonly abortMultipartUseCase: AbortMultipartUseCase,
    private readonly getDownloadUrlUseCase: GetDownloadUrlUseCase,
  ) {}

  @Post('/initiate')
  @ApiOperation({
    summary: 'Initiate a multipart upload',
    description:
      'Initiates a multipart upload session for a file and returns the upload ID required for uploading its parts.',
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    description: 'Multipart upload session created',
    type: InitiateMultipartResponseDto,
  })
  async initiateMultipart(@Body() dto: InitiateMultipartRequestDto) {
    return this.initiateMultipartUseCase.execute(dto);
  }

  @Post('/part-url')
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

  @Post('/complete')
  @ApiOperation({
    summary: 'Complete a multipart upload',
    description:
      'Completes a multipart upload by combining all uploaded parts into the final file stored in the AWS S3 bucket.',
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    description: 'Multipart upload completed',
    type: CompleteMultipartResponseDto,
  })
  async completeMultipart(@Body() dto: CompleteMultipartRequestDto) {
    return this.completeMultipartUseCase.execute(dto);
  }

  @Post('/abort')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Abort a multipart upload',
    description:
      'Aborts an active multipart upload and discards all uploaded parts associated with the upload.',
  })
  async abortMultipart(@Body() dto: AbortMultipartRequestDto): Promise<void> {
    await this.abortMultipartUseCase.execute(dto);
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
