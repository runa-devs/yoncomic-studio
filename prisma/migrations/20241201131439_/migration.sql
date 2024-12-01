/*
  Warnings:

  - You are about to drop the column `original` on the `panels` table. All the data in the column will be lost.
  - You are about to drop the column `sdPrompt` on the `panels` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[civitaiJobId]` on the table `panels` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `negativePrompt` to the `panels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `panels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_panelId_fkey";

-- AlterTable
ALTER TABLE "panels" DROP COLUMN "original",
DROP COLUMN "sdPrompt",
ADD COLUMN     "civitaiJobId" TEXT,
ADD COLUMN     "key" TEXT,
ADD COLUMN     "negativePrompt" TEXT NOT NULL,
ADD COLUMN     "originalKey" TEXT,
ADD COLUMN     "prompt" TEXT NOT NULL;

-- DropTable
DROP TABLE "images";

-- CreateIndex
CREATE UNIQUE INDEX "panels_civitaiJobId_key" ON "panels"("civitaiJobId");
