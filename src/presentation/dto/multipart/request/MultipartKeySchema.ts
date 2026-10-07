import z from 'zod';

import { FILE_KEY_PREFIX } from '@/shared/constants';

import { parseMultipartKey } from '@/use-case/multipart/MultipartKey';

/**
 * Dosyalar yalnızca `<prefix>public/` ya da `<prefix>private/` klasörünün doğrudan
 * altında tutulur; farklı bir klasördeki nesnelere erişimi engeller.
 */

export const multipartKeySchema = z
  .string()
  .refine((key) => parseMultipartKey(key) !== null, {
    message: `key must be directly under ${FILE_KEY_PREFIX}public/ or ${FILE_KEY_PREFIX}private/`,
  });
