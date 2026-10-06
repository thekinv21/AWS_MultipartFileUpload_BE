import { Body, Controller, Post, Version } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { S3Service } from '@/infrastructure/storage';

import {
  AbortMultipartUploadRequestDto,
  CompleteMultipartUploadRequestDto,
  GetPresignedPartUrlRequestDto,
  InitiateMultipartUploadRequestDto,
} from '../dto/upload/request';
import {
  GetPresignedPartUrlResponseDto,
  InitiateMultipartUploadResponseDto,
} from '../dto/upload/response';

@Controller('/upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

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
  async initiateMultipart(
    @Body() dto: InitiateMultipartUploadRequestDto,
  ): Promise<InitiateMultipartUploadResponseDto> {
    return this.s3Service.initiateMultipartUpload(dto);
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
  async getPartUrl(
    @Body() dto: GetPresignedPartUrlRequestDto,
  ): Promise<GetPresignedPartUrlResponseDto> {
    return this.s3Service.getPresignedPartUrl(dto);
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
  async completeMultipart(@Body() dto: CompleteMultipartUploadRequestDto) {
    return this.s3Service.completeMultipartUpload(dto);
  }

  @Version('1')
  @Post('/abort-multipart')
  @ApiOperation({
    summary: 'Abort a multipart upload',
    description:
      'Aborts an active multipart upload and discards all uploaded parts associated with the upload.',
  })
  @ApiBody({
    type: AbortMultipartUploadRequestDto,
  })
  async abortMultipart(@Body() dto: AbortMultipartUploadRequestDto) {
    return this.s3Service.abortMultipartUpload(dto);
  }
}
