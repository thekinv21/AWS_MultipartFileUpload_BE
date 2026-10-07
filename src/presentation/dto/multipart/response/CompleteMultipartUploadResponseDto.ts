import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const completeMultipartUploadResponseSchema = z.strictObject({
  key: z.string(),
  name: z.string(),
  extension: z.string(),
  size: z.number(),
  isPublic: z.boolean(),
  url: z.url().nullable(),
});

export class CompleteMultipartUploadResponseDto extends createZodDto(
  completeMultipartUploadResponseSchema,
) {}
