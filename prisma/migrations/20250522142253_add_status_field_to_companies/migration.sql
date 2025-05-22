-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ativo', 'inativo');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ativo';
