import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Client } from '@aws-sdk/client-s3';

import { UploadPort } from '@/use-case/upload/port';

import { S3Service } from './S3Service';

@Global()
@Module({
  providers: [
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new S3Client({
          region: configService.getOrThrow<string>('AWS_S3_REGION'),
          credentials: {
            accessKeyId: configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.getOrThrow<string>(
              'AWS_SECRET_ACCESS_KEY',
            ),
          },
          /**
           * Varsayılan (WHEN_SUPPORTED) presigned part URL'lerine boş gövdenin
           * CRC32 değerini gömer; client gerçek parçayı yüklediğinde S3 reddeder.
           */
          requestChecksumCalculation: 'WHEN_REQUIRED',
        }),
    },
    S3Service,
    { provide: UploadPort, useExisting: S3Service },
  ],
  exports: [UploadPort],
})
export class S3Module {}
