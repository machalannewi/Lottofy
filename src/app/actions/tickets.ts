"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthState, getCurrentUser } from "@/lib/auth";
import { generateTicketNumber, generateTicketNumbers } from "@/lib/ticket";
import { ensureUserExists } from "@/lib/data";

export async function generateTicketAction(drawId: string) {
  const { userId } = await getAuthState();
  if (!userId) {
    return { error: "You must be signed in to generate a ticket." };
  }

  const clerkUser = await getCurrentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const dbUser = await ensureUserExists(userId, email);

  if (dbUser.status === "BANNED") {
    return { error: "Your account has been suspended." };
  }

  const draw = await prisma.draw.findUnique({ where: { id: drawId } });
  if (!draw || draw.status !== "UPCOMING") {
    return { error: "This draw is no longer accepting tickets." };
  }

  if (!draw.isFree) {
    return { error: "Maximum number of participant is selected" };
  }

  const existing = await prisma.ticket.findUnique({
    where: { userId_drawId: { userId, drawId } },
  });
  if (existing) {
    return { ticket: existing };
  }

  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber: generateTicketNumber(draw.drawDate),
      numbers: generateTicketNumbers(),
      userId,
      drawId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/draws");
  revalidatePath("/admin");
  revalidatePath("/admin/draws");
  return { ticket };
}
