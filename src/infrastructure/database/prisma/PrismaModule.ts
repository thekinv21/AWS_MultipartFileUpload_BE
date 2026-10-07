import { Global, Module } from '@nestjs/common';

import { FileRepositoryPort } from '@/use-case/file/port';

import { FileRepository } from './file';
import { PrismaService } from './PrismaService';

@Global()
@Module({
  providers: [
    PrismaService,
    FileRepository,
    { provide: FileRepositoryPort, useExisting: FileRepository },
  ],
  exports: [PrismaService, FileRepositoryPort],
})
export class PrismaModule {}
