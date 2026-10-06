import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const initiateMultipartUploadRequestSchema = z.strictObject({
  fileName: z.string().nonempty(),
  contentType: z.string().nonempty(),
});

export class InitiateMultipartUploadRequestDto extends createZodDto(
  initiateMultipartUploadRequestSchema,
) {}
