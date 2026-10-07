import { randomUUID } from 'crypto';

import { FILE_KEY_PREFIX } from '@/shared/constants';
import { getFileExtension } from '@/shared/utils';

import { TMultipartKeyInfo } from './types';

/**
 * randomUUID() (36 karakter) + '-'
 */

const UUID_SEGMENT_LENGTH = 37;

/**
 * Key biçimi: `<prefix><public|private>/<uuid>-<fileName>`.
 * Erişim türü key'in klasörüdür; uploadId key'e bağlı olduğu için client
 * sonradan değiştiremez.
 */

export function buildMultipartKey(fileName: string, isPublic: boolean): string {
  const folder = isPublic ? 'public' : 'private';

  return `${FILE_KEY_PREFIX}${folder}/${randomUUID()}-${fileName}`;
}

/**
 * Key bu biçimde değilse null döner.
 */

export function parseMultipartKey(key: string): TMultipartKeyInfo | null {
  if (!key.startsWith(FILE_KEY_PREFIX)) {
    return null;
  }

  const [folder, storedName, ...rest] = key
    .slice(FILE_KEY_PREFIX.length)
    .split('/');

  if (
    (folder !== 'public' && folder !== 'private') ||
    !storedName ||
    rest.length > 0
  ) {
    return null;
  }

  const name = storedName.slice(UUID_SEGMENT_LENGTH) || storedName;

  return {
    name,
    extension: getFileExtension(name) ?? '',
    isPublic: folder === 'public',
  };
}
