/*
  Warnings:

  - Made the column `type` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "size" SET NOT NULL;
