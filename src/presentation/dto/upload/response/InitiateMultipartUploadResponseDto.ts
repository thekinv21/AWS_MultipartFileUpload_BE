import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const initiateMultipartUploadResponseSchema = z.strictObject({
  key: z.string().nonempty(),
  uploadId: z.string().nonempty(),
  chunkSize: z.number(),
});

export class InitiateMultipartUploadResponseDto extends createZodDto(
  initiateMultipartUploadResponseSchema,
) {}
