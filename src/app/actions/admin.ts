"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthState } from "@/lib/auth";
import { Resend } from "resend";

async function requireAdmin() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) throw new Error("Forbidden: admin access required.");
}

export async function createDrawAction(input: {
  drawDate: string;
  prizeAmount: number;
}) {
  await requireAdmin();

  await prisma.draw.create({
    data: {
      drawDate: new Date(input.drawDate),
      prizeAmount: input.prizeAmount,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/draws");
  revalidatePath("/draws");
  revalidatePath("/");
}

export async function pickWinnerAction(input: {
  ticketId: string;
  drawId: string;
  userId: string;
  prizeAmount: number;
}) {
  await requireAdmin();

  await prisma.$transaction([
    prisma.winner.create({
      data: {
        ticketId: input.ticketId,
        userId: input.userId,
        drawId: input.drawId,
        prizeAmount: input.prizeAmount,
      },
    }),
    prisma.draw.update({
      where: { id: input.drawId },
      data: { status: "COMPLETED" },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/draws");
  revalidatePath("/admin/winners");
  revalidatePath("/draws");
  revalidatePath("/winners");
  revalidatePath("/");
}

export async function setWinnerStatusAction(
  winnerId: string,
  status: "APPROVED" | "REJECTED" | "CLAIMED"
) {
  await requireAdmin();

  await prisma.winner.update({
    where: { id: winnerId },
    data: { status },
  });

  revalidatePath("/admin/winners");
  revalidatePath("/winners");
  revalidatePath("/");
}

export async function setUserStatusAction(
  userId: string,
  status: "ACTIVE" | "BANNED"
) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function deleteUserAction(userId: string) {
  await requireAdmin();

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function sendBroadcastEmailAction(input: {
  subject: string;
  message: string;
  segment: "all" | "active";
}) {
  await requireAdmin();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      error:
        "Resend isn't configured yet. Add RESEND_API_KEY to your .env file.",
    };
  }

  const recipients = await prisma.user.findMany({
    where: input.segment === "active" ? { status: "ACTIVE" } : {},
    select: { email: true },
  });

  if (recipients.length === 0) {
    return { error: "No recipients matched this segment." };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Lottofy <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: recipients.map((r) => r.email),
    subject: input.subject,
    text: input.message,
  });

  return { sent: recipients.length };
}
