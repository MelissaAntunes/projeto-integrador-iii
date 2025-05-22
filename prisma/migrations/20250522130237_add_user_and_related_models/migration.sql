/*
  Warnings:

  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Company";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_areas" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "business_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_business_areas" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "businessAreaId" TEXT NOT NULL,

    CONSTRAINT "company_business_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keywords" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_keywords" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "companyId" TEXT NOT NULL,
    "keywordId" TEXT NOT NULL,

    CONSTRAINT "company_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "keywords_name_key" ON "keywords"("name");

-- CreateIndex
CREATE UNIQUE INDEX "company_keywords_name_key" ON "company_keywords"("name");

-- AddForeignKey
ALTER TABLE "company_business_areas" ADD CONSTRAINT "company_business_areas_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_business_areas" ADD CONSTRAINT "company_business_areas_businessAreaId_fkey" FOREIGN KEY ("businessAreaId") REFERENCES "business_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_keywords" ADD CONSTRAINT "company_keywords_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_keywords" ADD CONSTRAINT "company_keywords_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "keywords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
