-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetPasswordExpiration" BIGINT,
ADD COLUMN     "resetPasswordToken" TEXT;
