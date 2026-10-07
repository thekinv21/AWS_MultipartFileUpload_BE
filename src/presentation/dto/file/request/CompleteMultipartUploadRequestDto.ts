import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { MAX_PART_NUMBER } from '@/shared/constants';

import {
  multipartUploadTargetSchema,
  partNumberSchema,
} from './MultipartUploadTargetSchema';

const completeMultipartUploadRequestSchema = multipartUploadTargetSchema.extend(
  {
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
  },
);

export class CompleteMultipartUploadRequestDto extends createZodDto(
  completeMultipartUploadRequestSchema,
) {}
