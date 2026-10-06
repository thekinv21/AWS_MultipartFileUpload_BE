import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiBody, ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';

import { ZodResponse } from 'nestjs-zod';

import { AbortMultipartUseCase } from '@/use-case/upload/AbortMultipartUseCase';
import { CompleteMultipartUseCase } from '@/use-case/upload/CompleteMultipartUseCase';
import { GetPresignedPartUrlUseCase } from '@/use-case/upload/GetPresignedPartUrlUseCase';
import { InitiateMultipartUseCase } from '@/use-case/upload/InitiateMultipartUseCase';

import {
  AbortMultipartUploadRequestDto,
  CompleteMultipartUploadRequestDto,
  GetPresignedPartUrlRequestDto,
  InitiateMultipartUploadRequestDto,
} from '../dto/upload/request';
import {
  CompleteMultipartUploadResponseDto,
  GetPresignedPartUrlResponseDto,
  InitiateMultipartUploadResponseDto,
} from '../dto/upload/response';

@Controller('/upload')
export class UploadController {
  constructor(
    private readonly initiateMultipartUseCase: InitiateMultipartUseCase,
    private readonly getPresignedUrlUseCase: GetPresignedPartUrlUseCase,
    private readonly completeMultipartUseCase: CompleteMultipartUseCase,
    private readonly abortMultipartUseCase: AbortMultipartUseCase,
  ) {}

  @Version('1')
  @Post('/initiate-multipart')
  @ApiOperation({
    summary: 'Initiate a multipart upload',
    description:
      'Initiates a multipart upload session for a file and returns the upload ID required for uploading its parts.',
  })
  @ApiBody({
    type: InitiateMultipartUploadRequestDto,
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    description: 'Multipart upload session created',
    type: InitiateMultipartUploadResponseDto,
  })
  async initiateMultipart(@Body() dto: InitiateMultipartUploadRequestDto) {
    return this.initiateMultipartUseCase.execute(dto);
  }

  @Version('1')
  @Post('/part-url')
  @ApiOperation({
    summary: 'Generate a presigned URL for a multipart upload part',
    description:
      'Generates a presigned URL that allows a specific part of a file to be uploaded directly to an AWS S3 bucket.',
  })
  @ApiBody({
    type: GetPresignedPartUrlRequestDto,
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    description: 'Presigned URL for the requested part',
    type: GetPresignedPartUrlResponseDto,
  })
  async getPartUrl(@Body() dto: GetPresignedPartUrlRequestDto) {
    return this.getPresignedUrlUseCase.execute(dto);
  }

  @Version('1')
  @Post('/complete-multipart')
  @ApiOperation({
    summary: 'Complete a multipart upload',
    description:
      'Completes a multipart upload by combining all uploaded parts into the final file stored in the AWS S3 bucket.',
  })
  @ApiBody({
    type: CompleteMultipartUploadRequestDto,
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    description: 'Multipart upload completed',
    type: CompleteMultipartUploadResponseDto,
  })
  async completeMultipart(@Body() dto: CompleteMultipartUploadRequestDto) {
    return this.completeMultipartUseCase.execute(dto);
  }

  @Version('1')
  @Post('/abort-multipart')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Abort a multipart upload',
    description:
      'Aborts an active multipart upload and discards all uploaded parts associated with the upload.',
  })
  @ApiBody({
    type: AbortMultipartUploadRequestDto,
  })
  @ApiNoContentResponse({ description: 'Multipart upload aborted' })
  async abortMultipart(
    @Body() dto: AbortMultipartUploadRequestDto,
  ): Promise<void> {
    await this.abortMultipartUseCase.execute(dto);
  }
}
