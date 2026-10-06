import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { MAX_FILE_SIZE_BYTES } from '@/shared/constants';

const FileUploadRequestSchema = z.strictObject({
  file: z.file().max(MAX_FILE_SIZE_BYTES),
});

const MultiFileUploadRequestSchema = z.strictObject({
  file: z.array(z.file().max(MAX_FILE_SIZE_BYTES)),
});

export class MultiFileUploadRequestDto extends createZodDto(
  MultiFileUploadRequestSchema,
) {}

export class FileUploadRequestDto extends createZodDto(
  FileUploadRequestSchema,
) {}
