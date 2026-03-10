/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,name]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `StaffService` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_tenantId_idx";

-- CreateTable
CREATE TABLE "TemplateConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "accentColor" TEXT,
    "fontPrimary" TEXT NOT NULL DEFAULT 'Inter',
    "fontSecondary" TEXT NOT NULL DEFAULT 'Playfair Display',
    "borderRadius" TEXT NOT NULL DEFAULT '16px',
    "layoutStyle" TEXT NOT NULL,
    "defaultTitle" TEXT NOT NULL,
    "defaultSubtitle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StaffService" (
    "staffId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "duration" INTEGER,
    "price" REAL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("staffId", "serviceId"),
    CONSTRAINT "StaffService_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StaffService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StaffService_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StaffService" ("duration", "price", "serviceId", "staffId") SELECT "duration", "price", "serviceId", "staffId" FROM "StaffService";
DROP TABLE "StaffService";
ALTER TABLE "new_StaffService" RENAME TO "StaffService";
CREATE INDEX "StaffService_tenantId_idx" ON "StaffService"("tenantId");
CREATE TABLE "new_Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "slotStep" INTEGER NOT NULL DEFAULT 30,
    "plan" TEXT NOT NULL DEFAULT 'start',
    "website" JSONB,
    "templateId" TEXT NOT NULL DEFAULT 'lash-beauty',
    "customization" JSONB,
    "websiteConfig" JSONB,
    "theme" JSONB,
    "publishedAt" DATETIME,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Tenant" ("createdAt", "id", "name", "slotStep", "slug", "theme", "timezone", "updatedAt", "websiteConfig") SELECT "createdAt", "id", "name", "slotStep", "slug", "theme", "timezone", "updatedAt", "websiteConfig" FROM "Tenant";
DROP TABLE "Tenant";
ALTER TABLE "new_Tenant" RENAME TO "Tenant";
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");
CREATE INDEX "Tenant_slug_idx" ON "Tenant"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Appointment_tenantId_startTime_idx" ON "Appointment"("tenantId", "startTime");

-- CreateIndex
CREATE INDEX "Appointment_status_startTime_idx" ON "Appointment"("status", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_tenantId_phone_key" ON "Customer"("tenantId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "Service_tenantId_name_key" ON "Service"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_tenantId_name_key" ON "Staff"("tenantId", "name");
