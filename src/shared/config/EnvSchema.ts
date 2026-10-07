import z from 'zod';

const S3_MIN_PART_SIZE_BYTES = 5 * 1024 * 1024;

const S3_MAX_PART_NUMBER = 10000;

const S3_MAX_PRESIGNED_URL_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

const positiveInt = () => z.coerce.number().int().positive();

const nonEmptyString = () => z.string().trim().nonempty();

/**
 * "http://localhost:3000, http://localhost:3001" → ['http://localhost:3000', 'http://localhost:3001']
 */

const urlList = () =>
  z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.url()).nonempty());

export const envSchema = z
  .looseObject({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: positiveInt().max(65535),
    CORS_ORIGINS: urlList(),

    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),

    AWS_BUCKET_NAME: nonEmptyString(),
    AWS_S3_REGION: nonEmptyString(),
    AWS_ACCESS_KEY_ID: nonEmptyString(),
    AWS_SECRET_ACCESS_KEY: nonEmptyString(),
    AWS_PUBLIC_BASE_URL: z
      .url()
      .transform((value) => value.replace(/\/+$/, ''))
      .optional(),

    AWS_UPLOAD_KEY_PREFIX: z.string().trim().nonempty().endsWith('/'),
    AWS_PRESIGNED_URL_EXPIRES_IN: positiveInt().max(
      S3_MAX_PRESIGNED_URL_EXPIRES_IN_SECONDS,
    ),
    AWS_FILE_MAX_SIZE_BYTES: positiveInt(),
    AWS_FILE_MAX_NAME_LENGTH: positiveInt(),
    AWS_FILE_CHUNK_SIZE: positiveInt().min(S3_MIN_PART_SIZE_BYTES),
    AWS_FILE_MIN_PART_NUMBER: positiveInt(),
    AWS_FILE_MAX_PART_NUMBER: positiveInt().max(S3_MAX_PART_NUMBER),
  })
  .superRefine((env, ctx) => {
    if (env.AWS_FILE_MIN_PART_NUMBER > env.AWS_FILE_MAX_PART_NUMBER) {
      ctx.addIssue({
        code: 'custom',
        path: ['AWS_FILE_MIN_PART_NUMBER'],
        message: 'must not be greater than AWS_FILE_MAX_PART_NUMBER',
      });
    }

    /**
     * En büyük dosya, izin verilen part sayısına sığmalıdır
     */

    if (
      env.AWS_FILE_MAX_SIZE_BYTES >
      env.AWS_FILE_CHUNK_SIZE * env.AWS_FILE_MAX_PART_NUMBER
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['AWS_FILE_MAX_SIZE_BYTES'],
        message:
          'must not exceed AWS_FILE_CHUNK_SIZE * AWS_FILE_MAX_PART_NUMBER',
      });
    }
  });
