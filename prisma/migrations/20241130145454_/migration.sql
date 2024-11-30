/*
  Warnings:

  - You are about to drop the column `image` on the `panels` table. All the data in the column will be lost.
  - Added the required column `original` to the `panels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sdPrompt` to the `panels` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PanelStatus" AS ENUM ('PENDING', 'GENERATING_TAGS', 'GENERATING_IMAGE', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "panels" DROP COLUMN "image",
ADD COLUMN     "original" TEXT NOT NULL,
ADD COLUMN     "sdPrompt" TEXT NOT NULL,
ADD COLUMN     "status" "PanelStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_panelId_key" ON "images"("panelId");

-- CreateIndex
CREATE UNIQUE INDEX "images_panelId_key_key" ON "images"("panelId", "key");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "panels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
