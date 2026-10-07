import z from 'zod';

import { FILE_KEY_PREFIX } from '@/shared/constants';

/**
 * Dosyalar yalnızca prefix'in doğrudan altında tutulur;
 * farklı bir klasördeki nesnelere erişimi engeller.
 */

export const fileKeySchema = z
  .string()
  .startsWith(FILE_KEY_PREFIX)
  .refine((key) => !key.slice(FILE_KEY_PREFIX.length).includes('/'), {
    message: `key must be directly under ${FILE_KEY_PREFIX}`,
  });
