-- AlterTable
ALTER TABLE "Status" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Status_userId_idx" ON "Status"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_userId_key" ON "Status"("name", "userId");

