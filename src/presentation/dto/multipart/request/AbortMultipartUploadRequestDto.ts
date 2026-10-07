import { createZodDto } from 'nestjs-zod';

import { multipartUploadTargetSchema } from './MultipartUploadTargetSchema';

export class AbortMultipartUploadRequestDto extends createZodDto(
  multipartUploadTargetSchema,
) {}
