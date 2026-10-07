import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { fileKeySchema } from './FileKeySchema';

const getDownloadUrlRequestSchema = z.strictObject({
  key: fileKeySchema,
});

export class GetDownloadUrlRequestDto extends createZodDto(
  getDownloadUrlRequestSchema,
) {}
