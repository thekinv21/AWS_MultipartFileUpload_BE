import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const completeMultipartResponseSchema = z.strictObject({
  key: z.string(),
  name: z.string(),
  extension: z.string(),
  size: z.number(),
  isPublic: z.boolean(),
  url: z.url().nullable(),
});

export class CompleteMultipartResponseDto extends createZodDto(
  completeMultipartResponseSchema,
) {}
