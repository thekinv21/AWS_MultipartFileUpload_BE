import z from 'zod';

import { MAX_PART_NUMBER, MIN_PART_NUMBER } from '@/shared/constants';

import { fileKeySchema } from './FileKeySchema';

/**
 * Multipart upload'a ait endpoint'lerde ortak kullanılan alanlar.
 */

export const multipartUploadTargetSchema = z.strictObject({
  key: fileKeySchema,
  uploadId: z.string().nonempty(),
});

export const partNumberSchema = z
  .number()
  .int()
  .min(MIN_PART_NUMBER)
  .max(MAX_PART_NUMBER);
