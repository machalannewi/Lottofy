"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthState } from "@/lib/auth";
import { getMailer } from "@/lib/email";
import { formatCurrency, formatDate } from "@/lib/format";
import { Resend } from "resend";

async function requireAdmin() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) throw new Error("Forbidden: admin access required.");
}

export async function createDrawAction(input: {
  name: string;
  drawDate: string;
  prizeAmount: number;
  isFree: boolean;
  entryAmount?: number;
}) {
  await requireAdmin();

  await prisma.draw.create({
    data: {
      name: input.name,
      drawDate: new Date(input.drawDate),
      prizeAmount: input.prizeAmount,
      isFree: input.isFree,
      entryAmount: input.isFree ? 0 : input.entryAmount ?? 0,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/draws");
  revalidatePath("/draws");
  revalidatePath("/");
}

export async function deleteDrawAction(drawId: string) {
  await requireAdmin();

  const winners = await prisma.winner.findMany({
    where: { drawId, status: { not: "REJECTED" } },
  });

  await prisma.$transaction([
    ...winners.map((winner) =>
      prisma.user.update({
        where: { id: winner.userId },
        data: { balance: { decrement: winner.prizeAmount } },
      })
    ),
    prisma.draw.delete({ where: { id: drawId } }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/draws");
  revalidatePath("/admin/winners");
  revalidatePath("/draws");
  revalidatePath("/winners");
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
    prisma.user.update({
      where: { id: input.userId },
      data: { balance: { increment: input.prizeAmount } },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/draws");
  revalidatePath("/admin/winners");
  revalidatePath("/draws");
  revalidatePath("/winners");
  revalidatePath("/");
  revalidatePath("/dashboard");

  // Best-effort: never let an email hiccup undo a winner that's already
  // been recorded and credited.
  try {
    const [user, draw] = await Promise.all([
      prisma.user.findUnique({ where: { id: input.userId } }),
      prisma.draw.findUnique({ where: { id: input.drawId } }),
    ]);

    const transporter = getMailer();

    if (user) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        replyTo: process.env.SMTP_USER,
        subject: "You won on Lottofy!",
        text: `Hi${user.firstName ? ` ${user.firstName}` : ""},

Congratulations — you've been selected as a winner${draw ? ` in ${draw.name ?? "the"} draw (${formatDate(draw.drawDate)})` : ""}!

Prize: ${formatCurrency(input.prizeAmount)}

This amount has been added to your account balance. Sign in to your dashboard to see it and request a withdrawal.

— The Lottofy team`,
      });
    }
  } catch {
    // Swallow — the winner record and balance credit already succeeded.
  }
}

export async function setWinnerStatusAction(
  winnerId: string,
  status: "APPROVED" | "REJECTED" | "CLAIMED"
) {
  await requireAdmin();

  const winner = await prisma.winner.findUniqueOrThrow({
    where: { id: winnerId },
  });

  const movingIntoRejected = winner.status !== "REJECTED" && status === "REJECTED";
  const movingOutOfRejected = winner.status === "REJECTED" && status !== "REJECTED";

  await prisma.$transaction([
    prisma.winner.update({ where: { id: winnerId }, data: { status } }),
    ...(movingIntoRejected
      ? [
          prisma.user.update({
            where: { id: winner.userId },
            data: { balance: { decrement: winner.prizeAmount } },
          }),
        ]
      : []),
    ...(movingOutOfRejected
      ? [
          prisma.user.update({
            where: { id: winner.userId },
            data: { balance: { increment: winner.prizeAmount } },
          }),
        ]
      : []),
  ]);

  revalidatePath("/admin/winners");
  revalidatePath("/winners");
  revalidatePath("/");
  revalidatePath("/dashboard");
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

export async function setWithdrawalStatusAction(
  requestId: string,
  status: "PENDING" | "PROCESSED"
) {
  await requireAdmin();

  await prisma.withdrawalRequest.update({
    where: { id: requestId },
    data: { status },
  });

  revalidatePath("/admin/withdrawals");
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
