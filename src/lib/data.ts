import "server-only";
import { prisma } from "@/lib/prisma";

export function getNextUpcomingDraw() {
  return prisma.draw.findFirst({
    where: { status: "UPCOMING" },
    orderBy: { drawDate: "asc" },
  });
}

export function getUpcomingDraws() {
  return prisma.draw.findMany({
    where: { status: "UPCOMING" },
    orderBy: { drawDate: "asc" },
  });
}

export function getAllDraws() {
  return prisma.draw.findMany({
    orderBy: { drawDate: "desc" },
    include: { _count: { select: { tickets: true } } },
  });
}

export function getAllWinners() {
  return prisma.winner.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, draw: true, ticket: true },
  });
}

export function getPublicWinners() {
  return prisma.winner.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: { user: true, draw: true, ticket: true },
    take: 25,
  });
}

export function getUserTicketForDraw(userId: string, drawId: string) {
  return prisma.ticket.findUnique({
    where: { userId_drawId: { userId, drawId } },
  });
}

export function getUserTickets(userId: string) {
  return prisma.ticket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { draw: true, winner: true },
  });
}

export async function ensureUserExists(
  userId: string,
  email: string,
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    country?: string | null;
  }
) {
  return prisma.user.upsert({
    where: { id: userId },
    update: { email, ...profile },
    create: { id: userId, email, ...profile },
  });
}

export function getDrawWithParticipants(drawId: string) {
  return prisma.draw.findUnique({
    where: { id: drawId },
    include: {
      tickets: {
        orderBy: { createdAt: "asc" },
        include: { user: true, winner: true },
      },
      winners: true,
    },
  });
}

export function getAllUsers(search?: string) {
  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { id: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tickets: true, winners: true } } },
  });
}

export function getWithdrawalRequests() {
  return prisma.withdrawalRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
}

export async function getAdminOverviewStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalUsers, ticketsToday, upcomingDraw, totalWinners] =
    await Promise.all([
      prisma.user.count(),
      prisma.ticket.count({ where: { createdAt: { gte: startOfToday } } }),
      getNextUpcomingDraw(),
      prisma.winner.count(),
    ]);

  return { totalUsers, ticketsToday, upcomingDraw, totalWinners };
}
