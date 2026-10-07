import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const initiateMultipartUploadResponseSchema = z.strictObject({
  key: z.string(),
  uploadId: z.string(),
  chunkSize: z.number(),
});

export class InitiateMultipartUploadResponseDto extends createZodDto(
  initiateMultipartUploadResponseSchema,
) {}
