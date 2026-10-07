import z from 'zod';

import { MAX_PART_NUMBER, MIN_PART_NUMBER } from '@/shared/constants';

import { multipartKeySchema } from './MultipartKeySchema';

/**
 * Multipart upload'a ait endpoint'lerde ortak kullanılan alanlar.
 */

export const multipartUploadTargetSchema = z.strictObject({
  key: multipartKeySchema,
  uploadId: z.string().nonempty(),
});

export const partNumberSchema = z
  .number()
  .int()
  .min(MIN_PART_NUMBER)
  .max(MAX_PART_NUMBER);
