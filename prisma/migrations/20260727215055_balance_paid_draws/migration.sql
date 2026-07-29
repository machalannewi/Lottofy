-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_drawId_fkey";

-- DropForeignKey
ALTER TABLE "Winner" DROP CONSTRAINT "Winner_drawId_fkey";

-- AlterTable
ALTER TABLE "Draw" ADD COLUMN     "entryAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Winner" ADD CONSTRAINT "Winner_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE CASCADE ON UPDATE CASCADE;
