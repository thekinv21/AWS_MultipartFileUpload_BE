import { TFileRecord } from '../types';

export abstract class FileRepositoryPort {
  abstract create(data: TFileRecord): Promise<TFileRecord>;

  abstract findByKey(key: string): Promise<TFileRecord | null>;
}
