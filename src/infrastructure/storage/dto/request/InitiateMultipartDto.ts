import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const initiateMultipartSchema = z.strictObject({
  fileName: z.string().nonempty(),
  contentType: z.string().nonempty(),
});

export class InitiateMultipartDto extends createZodDto(
  initiateMultipartSchema,
) {}
