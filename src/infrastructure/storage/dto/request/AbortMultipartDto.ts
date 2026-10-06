import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const abortMultipartSchema = z.strictObject({
  key: z.string().nonempty(),
  uploadId: z.string().nonempty(),
});

export class AbortMultipartDto extends createZodDto(abortMultipartSchema) {}
