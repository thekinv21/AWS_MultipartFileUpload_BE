export const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1024;

export const MAX_TOTAL_UPLOAD_SIZE_BYTES = 1024 * 1024 * 1024;

export const MAX_FILES_PER_REQUEST = 10;

export const MAX_FILE_NAME_LENGTH = 255;

export const MAX_CHUNK_SIZE = 5 * 1024 * 1024;

export const ALLOWED_FILE_TYPES: Record<string, readonly string[]> = {
  pdf: ['application/pdf'],
  doc: ['application/msword'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  txt: ['text/plain'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  csv: ['text/csv'],
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
