import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Client } from '@aws-sdk/client-s3';

import { TEnv } from '@/shared/types';

import { FileStoragePort } from '@/use-case/file/port';

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
           * Varsayılan (WHEN_SUPPORTED) presigned part URL'lerine boş gövdenin
           * CRC32 değerini gömer; client gerçek parçayı yüklediğinde S3 reddeder.
           */
          requestChecksumCalculation: 'WHEN_REQUIRED',
        }),
    },
    S3Service,
    { provide: FileStoragePort, useExisting: S3Service },
  ],
  exports: [FileStoragePort],
})
export class S3Module {}
