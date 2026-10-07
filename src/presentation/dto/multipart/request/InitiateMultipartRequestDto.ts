import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { ALLOWED_FILE_TYPES, MAX_FILE_NAME_LENGTH } from '@/shared/constants';
import { getFileExtension } from '@/shared/utils';

const hasNoControlCharacters = (value: string): boolean =>
  !/\p{Cc}/u.test(value);

const initiateMultipartRequestSchema = z
  .strictObject({
    fileName: z
      .string()
      .trim()
      .nonempty()
      .max(MAX_FILE_NAME_LENGTH)
      .refine((name) => !/[/\\]/.test(name), {
        message: 'fileName must not contain path separators',
      })
      .refine(hasNoControlCharacters, {
        message: 'fileName must not contain control characters',
      }),
    contentType: z.string().nonempty(),
    isPublic: z.boolean().default(false),
  })
  .superRefine(({ fileName, contentType }, ctx) => {
    const extension = getFileExtension(fileName);

    if (!extension || !Object.hasOwn(ALLOWED_FILE_TYPES, extension)) {
      ctx.addIssue({
        code: 'custom',
        path: ['fileName'],
        message: 'File extension is not allowed',
      });
      return;
    }

    if (!ALLOWED_FILE_TYPES[extension].includes(contentType)) {
      ctx.addIssue({
        code: 'custom',
        path: ['contentType'],
        message: `contentType does not match the .${extension} extension`,
      });
    }
  });

export class InitiateMultipartRequestDto extends createZodDto(
  initiateMultipartRequestSchema,
) {}
