/*
  Warnings:

  - You are about to drop the column `user` on the `refreshToken` table. All the data in the column will be lost.
  - Added the required column `userId` to the `refreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "refreshToken" DROP CONSTRAINT "refreshToken_user_fkey";

-- AlterTable
ALTER TABLE "refreshToken" DROP COLUMN "user",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
