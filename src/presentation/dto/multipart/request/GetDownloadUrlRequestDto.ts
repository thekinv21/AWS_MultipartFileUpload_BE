import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { multipartKeySchema } from './MultipartKeySchema';

const getDownloadUrlRequestSchema = z.strictObject({
  key: multipartKeySchema,
});

export class GetDownloadUrlRequestDto extends createZodDto(
  getDownloadUrlRequestSchema,
) {}
