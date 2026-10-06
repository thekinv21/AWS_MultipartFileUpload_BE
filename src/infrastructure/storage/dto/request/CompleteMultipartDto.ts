import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const completeMultipartSchema = z.strictObject({
  key: z.string().nonempty(),
  uploadId: z.string().nonempty(),
  parts: z
    .array(
      z.object({
        PartNumber: z.number().nonnegative(),
        ETag: z.string().nonempty(),
      }),
    )
    .nonempty(),
});

export class CompleteMultipartDto extends createZodDto(
  completeMultipartSchema,
) {}
