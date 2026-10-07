import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const initiateMultipartUploadResponseSchema = z.strictObject({
  key: z.string(),
  uploadId: z.string(),
  chunkSize: z.number(),
  isPublic: z.boolean(),
});

export class InitiateMultipartUploadResponseDto extends createZodDto(
  initiateMultipartUploadResponseSchema,
) {}
