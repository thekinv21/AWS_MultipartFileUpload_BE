import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const initiateMultipartResponseSchema = z.strictObject({
  key: z.string(),
  uploadId: z.string(),
  chunkSize: z.number(),
  isPublic: z.boolean(),
});

export class InitiateMultipartResponseDto extends createZodDto(
  initiateMultipartResponseSchema,
) {}
