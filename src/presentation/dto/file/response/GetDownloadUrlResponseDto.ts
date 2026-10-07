import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const getDownloadUrlResponseSchema = z.strictObject({
  url: z.url(),
});

export class GetDownloadUrlResponseDto extends createZodDto(
  getDownloadUrlResponseSchema,
) {}
