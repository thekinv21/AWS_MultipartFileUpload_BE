import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const abortMultipartUploadRequestSchema = z.strictObject({
  key: z.string().nonempty(),
  uploadId: z.string().nonempty(),
});

export class AbortMultipartUploadRequestDto extends createZodDto(
  abortMultipartUploadRequestSchema,
) {}
