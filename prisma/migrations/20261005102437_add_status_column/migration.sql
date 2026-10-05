-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'UPLOADED');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'PENDING';
