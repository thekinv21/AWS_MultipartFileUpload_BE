import { Global, Module } from '@nestjs/common';

import { FileRepositoryPort } from '@/use-case/file/port';

import { FileRepository } from './file';
import { PrismaService } from './PrismaService';

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: FileRepositoryPort, useClass: FileRepository },
  ],
  exports: [PrismaService, FileRepositoryPort],
})
export class PrismaModule {}
