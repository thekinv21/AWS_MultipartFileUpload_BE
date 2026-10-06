import z from 'zod';

import {
  MAX_PART_NUMBER,
  MIN_PART_NUMBER,
  UPLOAD_KEY_PREFIX,
} from '@/shared/constants';

/**
 * Multipart upload'a ait endpoint'lerde ortak kullanılan alanlar.
 */

export const multipartUploadTargetSchema = z.strictObject({
  key: z
    .string()
    .startsWith(UPLOAD_KEY_PREFIX)
    .refine((key) => !key.slice(UPLOAD_KEY_PREFIX.length).includes('/'), {
      message: `key must be directly under ${UPLOAD_KEY_PREFIX}`,
    }),
  uploadId: z.string().nonempty(),
});

export const partNumberSchema = z
  .number()
  .int()
  .min(MIN_PART_NUMBER)
  .max(MAX_PART_NUMBER);
