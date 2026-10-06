import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const completeMultipartUploadResponseSchema = z.strictObject({
  key: z.string(),
});

export class CompleteMultipartUploadResponseDto extends createZodDto(
  completeMultipartUploadResponseSchema,
) {}
