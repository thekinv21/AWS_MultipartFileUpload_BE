import { createZodDto } from 'nestjs-zod';

import { multipartTargetSchema } from './MultipartTargetSchema';

export class AbortMultipartRequestDto extends createZodDto(
  multipartTargetSchema,
) {}
