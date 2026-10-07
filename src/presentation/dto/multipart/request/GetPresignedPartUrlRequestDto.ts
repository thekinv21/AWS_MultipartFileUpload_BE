import { createZodDto } from 'nestjs-zod';

import {
  multipartTargetSchema,
  partNumberSchema,
} from './MultipartTargetSchema';

const getPresignedPartUrlRequestSchema = multipartTargetSchema.extend({
  partNumber: partNumberSchema,
});

export class GetPresignedPartUrlRequestDto extends createZodDto(
  getPresignedPartUrlRequestSchema,
) {}
