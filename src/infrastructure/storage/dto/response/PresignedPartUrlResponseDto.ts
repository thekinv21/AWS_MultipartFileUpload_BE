import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const presignedPartUrlResponseSchema = z.strictObject({
  url: z.url(),
});

export class PresignedPartUrlResponseDto extends createZodDto(
  presignedPartUrlResponseSchema,
) {}
