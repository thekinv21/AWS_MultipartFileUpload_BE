import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { MAX_PART_NUMBER } from '@/shared/constants';

import {
  multipartTargetSchema,
  partNumberSchema,
} from './MultipartTargetSchema';

const completeMultipartRequestSchema = multipartTargetSchema.extend({
  parts: z
    .array(
      z.strictObject({
        PartNumber: partNumberSchema,
        ETag: z.string().nonempty(),
      }),
    )
    .nonempty()
    .max(MAX_PART_NUMBER)
    .refine(
      (parts) =>
        new Set(parts.map((part) => part.PartNumber)).size === parts.length,
      { message: 'PartNumber values must be unique' },
    ),
});

export class CompleteMultipartRequestDto extends createZodDto(
  completeMultipartRequestSchema,
) {}
