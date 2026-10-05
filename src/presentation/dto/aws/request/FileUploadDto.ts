import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { MAX_FILE_SIZE_BYTES } from '@/shared/constants';

const FileUploadSchema = z.strictObject({
  file: z.file().max(MAX_FILE_SIZE_BYTES),
});

const MultiFileUploadSchema = z.strictObject({
  files: z.array(z.file().max(MAX_FILE_SIZE_BYTES)),
});

export class MultiFileUploadDto extends createZodDto(MultiFileUploadSchema) {}

export class FileUploadDto extends createZodDto(FileUploadSchema) {}
