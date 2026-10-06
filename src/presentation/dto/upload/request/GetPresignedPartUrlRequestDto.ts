import { createZodDto } from 'nestjs-zod';

import {
  multipartUploadTargetSchema,
  partNumberSchema,
} from './MultipartUploadTargetSchema';

const getPresignedPartUrlRequestSchema = multipartUploadTargetSchema.extend({
  partNumber: partNumberSchema,
});

export class GetPresignedPartUrlRequestDto extends createZodDto(
  getPresignedPartUrlRequestSchema,
) {}
