import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { ALLOWED_FILE_TYPES, MAX_FILE_NAME_LENGTH } from '@/shared/constants';

const hasNoControlCharacters = (value: string): boolean =>
  !/\p{Cc}/u.test(value);

const getFileExtension = (fileName: string): string | undefined => {
  const dotIndex = fileName.lastIndexOf('.');

  return dotIndex > 0 ? fileName.slice(dotIndex + 1).toLowerCase() : undefined;
};

const initiateMultipartUploadRequestSchema = z
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

export class InitiateMultipartUploadRequestDto extends createZodDto(
  initiateMultipartUploadRequestSchema,
) {}
