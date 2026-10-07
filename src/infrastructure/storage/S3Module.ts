import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Client } from '@aws-sdk/client-s3';

import { TEnv } from '@/shared/types';

import { MultipartPort } from '@/use-case/multipart/port';

import { S3Service } from './S3Service';

@Global()
@Module({
  providers: [
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv, true>) =>
        new S3Client({
          region: configService.get('AWS_S3_REGION', { infer: true }),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID', {
              infer: true,
            }),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY', {
              infer: true,
            }),
          },
          /**
           * Embeds the CRC32 value of an empty body into
           * presigned part URLs
           * by default (WHEN_SUPPORTED); S3 rejects the request when the client
           * uploads the actual part.
           */
          requestChecksumCalculation: 'WHEN_REQUIRED',
        }),
    },
    { provide: MultipartPort, useClass: S3Service },
  ],
  exports: [MultipartPort],
})
export class S3Module {}
