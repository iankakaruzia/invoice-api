-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PENDING', 'PAID');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "description" TEXT,
    "status" "Status" NOT NULL,
    "paymentTerm" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "price" DOUBLE PRECISION,
    "quantity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_from" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "bill_from_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_to" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "bill_to_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_slug_key" ON "invoices"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bill_from_invoiceId_key" ON "bill_from"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "bill_to_invoiceId_key" ON "bill_to"("invoiceId");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_from" ADD CONSTRAINT "bill_from_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_to" ADD CONSTRAINT "bill_to_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
