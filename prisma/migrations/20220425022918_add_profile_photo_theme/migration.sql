-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "preferredTheme" "Theme",
ADD COLUMN     "profilePhoto" TEXT;
