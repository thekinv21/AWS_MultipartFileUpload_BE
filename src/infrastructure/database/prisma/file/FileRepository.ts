import { Injectable } from '@nestjs/common';

import { FileRepositoryPort } from '@/use-case/file/port';
import { TFileRecord } from '@/use-case/file/types';

import { File } from '../../../../../prisma/generated/prisma/client';
import { PrismaService } from '../PrismaService';

@Injectable()
export class FileRepository implements FileRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: TFileRecord): Promise<TFileRecord> {
    const file = await this.prismaService.file.create({
      data: {
        ...data,
        size: BigInt(data.size),
      },
    });

    return this.toRecord(file);
  }

  async findByKey(key: string): Promise<TFileRecord | null> {
    const file = await this.prismaService.file.findUnique({ where: { key } });

    return file ? this.toRecord(file) : null;
  }

  /**
   * Prisma modelini use-case kaydına çevirir; use-case Prisma tiplerini görmez.
   */

  private toRecord(file: File): TFileRecord {
    return {
      name: file.name,
      key: file.key,
      type: file.type,
      size: Number(file.size),
      isPublic: file.isPublic,
    };
  }
}
