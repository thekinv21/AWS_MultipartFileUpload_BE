import { env } from '../config';

export const MAX_FILE_SIZE_BYTES = env.AWS_FILE_MAX_SIZE_BYTES;

export const MAX_FILE_NAME_LENGTH = env.AWS_FILE_MAX_NAME_LENGTH;

export const MAX_CHUNK_SIZE = env.AWS_FILE_CHUNK_SIZE;

export const MIN_PART_NUMBER = env.AWS_FILE_MIN_PART_NUMBER;

export const MAX_PART_NUMBER = env.AWS_FILE_MAX_PART_NUMBER;

export const FILE_KEY_PREFIX = env.AWS_UPLOAD_KEY_PREFIX;

export const ALLOWED_FILE_TYPES: Record<string, readonly string[]> = {
  pdf: ['application/pdf'],
  doc: ['application/msword'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  txt: ['text/plain'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  csv: ['text/csv', 'application/vnd.ms-excel'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  gif: ['image/gif'],
  bmp: ['image/bmp'],
  ico: ['image/x-icon', 'image/vnd.microsoft.icon'],
};

export const ALLOWED_MIME_TYPES: string[] =
  Object.values(ALLOWED_FILE_TYPES).flat();
