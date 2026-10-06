import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const getPresignedPartUrlResponseSchema = z.strictObject({
  url: z.url(),
});

export class GetPresignedPartUrlResponseDto extends createZodDto(
  getPresignedPartUrlResponseSchema,
) {}
