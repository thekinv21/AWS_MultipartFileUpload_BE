import { BadRequestException, PipeTransform } from '@nestjs/common';

import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_PER_REQUEST,
  MAX_TOTAL_UPLOAD_SIZE_BYTES,
} from '@/shared/constants';

export class FileValidationPipe implements PipeTransform<
  Express.Multer.File | Express.Multer.File[],
  Express.Multer.File | Express.Multer.File[]
> {
  transform(
    file: Express.Multer.File | Express.Multer.File[],
  ): Express.Multer.File | Express.Multer.File[] {
    if (!file || (Array.isArray(file) && file.length === 0)) {
      throw new BadRequestException('File is required');
    }

    const fileList = Array.isArray(file) ? file : [file];

    this.checkFileCount(fileList);
    this.checkTotalSize(fileList);

    fileList.forEach((file) => this.checkFile(file));

    return file;
  }

  /**
   * @description Will be validate files count max 10 file per request
   * @param file
   */

  private checkFileCount(files: Express.Multer.File[]): void {
    if (files.length > MAX_FILES_PER_REQUEST) {
      throw new BadRequestException(
        `Maximum ${MAX_FILES_PER_REQUEST} files are allowed`,
      );
    }
  }

  /**
   * @description Will be validate total size of files - max 1GB file
   * @param file
   */

  private checkTotalSize(files: Express.Multer.File[]): void {
    const totalSize = files.reduce((total, file) => total + file.size, 0);

    if (totalSize > MAX_TOTAL_UPLOAD_SIZE_BYTES) {
      throw new BadRequestException(
        `Total upload size must not exceed ${MAX_TOTAL_UPLOAD_SIZE_BYTES} bytes`,
      );
    }
  }

  /**
   * @description Will be validate file extension and file size
   * @param file
   */

  private checkFile(file: Express.Multer.File): void {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File "${file.originalname}" exceeds the maximum size of ${MAX_FILE_SIZE_BYTES} bytes`,
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed`,
      );
    }
  }
}
