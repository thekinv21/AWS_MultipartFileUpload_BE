import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const getPresignedPartUrlSchema = z.strictObject({
  key: z.string().nonempty(),
  uploadId: z.string().nonempty(),
  partNumber: z.number().int().min(1).max(10000),
});

export class GetPresignedPartUrlDto extends createZodDto(
  getPresignedPartUrlSchema,
) {}
