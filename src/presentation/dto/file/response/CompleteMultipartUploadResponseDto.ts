import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const completeMultipartUploadResponseSchema = z.strictObject({
  name: z.string(),
  size: z.number(),
  key: z.string(),
  url: z.url().nullable(),
  isPublic: z.boolean(),
});

export class CompleteMultipartUploadResponseDto extends createZodDto(
  completeMultipartUploadResponseSchema,
) {}
