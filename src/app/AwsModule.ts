import { Module } from '@nestjs/common';

import { AwsController } from '@/presentation/controller/AwsController';

import { MultiUploadUseCase } from '@/use-case/aws/MultiUploadUseCase';
import { SingleUploadUseCase } from '@/use-case/aws/SingleUploadUseCase';

@Module({
  imports: [],
  controllers: [AwsController],
  providers: [SingleUploadUseCase, MultiUploadUseCase],
})
export class AwsModule {}
