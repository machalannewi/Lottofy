import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function generateTicketNumber(drawDate: Date) {
  const y = drawDate.getFullYear();
  const m = String(drawDate.getMonth() + 1).padStart(2, "0");
  const d = String(drawDate.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `GL-${y}${m}${d}-${rand}`;
}

function generateNumbers() {
  const pool = Array.from({ length: 49 }, (_, i) => i + 1);
  const picked: number[] = [];
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked.sort((a, b) => a - b);
}

async function main() {
  const users = await Promise.all(
    [
      { id: "user_seed_1", email: "amaka@example.com", country: "Nigeria" },
      { id: "user_seed_2", email: "chidi@example.com", country: "Nigeria" },
      { id: "user_seed_3", email: "grace@example.com", country: "Ghana" },
    ].map((u) =>
      prisma.user.upsert({ where: { id: u.id }, update: {}, create: u })
    )
  );

  const upcoming = await prisma.draw.create({
    data: {
      drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      prizeAmount: 500000,
      status: "UPCOMING",
    },
  });

  const past = await prisma.draw.create({
    data: {
      drawDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      prizeAmount: 250000,
      status: "COMPLETED",
    },
  });

  const pastTickets = await Promise.all(
    users.map((u) =>
      prisma.ticket.create({
        data: {
          ticketNumber: generateTicketNumber(past.drawDate),
          numbers: generateNumbers(),
          userId: u.id,
          drawId: past.id,
        },
      })
    )
  );

  await prisma.ticket.create({
    data: {
      ticketNumber: generateTicketNumber(upcoming.drawDate),
      numbers: generateNumbers(),
      userId: users[0].id,
      drawId: upcoming.id,
    },
  });

  const winningTicket = pastTickets[0];
  await prisma.winner.create({
    data: {
      ticketId: winningTicket.id,
      userId: winningTicket.userId,
      drawId: past.id,
      prizeAmount: past.prizeAmount,
      status: "APPROVED",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
