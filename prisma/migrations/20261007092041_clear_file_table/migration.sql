/*
  Warnings:

  - You are about to drop the column `status` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "status",
DROP COLUMN "uploadedAt",
ADD COLUMN     "url" TEXT;

-- DropEnum
DROP TYPE "FileStatus";
