import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const getPresignedPartUrlRequestSchema = z.strictObject({
  key: z.string().nonempty(),
  uploadId: z.string().nonempty(),
  partNumber: z.number(),
});

export class GetPresignedPartUrlRequestDto extends createZodDto(
  getPresignedPartUrlRequestSchema,
) {}
