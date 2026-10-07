-- AlterTable
ALTER TABLE "File" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- Mevcut satırların erişim bilgisi korunur
UPDATE "File" SET "isPublic" = true WHERE "access" = 'PUBLIC';

ALTER TABLE "File" DROP COLUMN "access",
DROP COLUMN "url";

-- DropEnum
DROP TYPE "FileAccess";
