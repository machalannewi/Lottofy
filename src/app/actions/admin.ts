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
  const info = await transporter.sendMail({
    from: `Spinworld <${process.env.SMTP_USER}>`,
    to: user.email,
    replyTo: process.env.SMTP_USER,
    subject: `Update on your ${draw?.name ?? "recent"} draw entry`,
    text: `Hi${user.firstName ? ` ${user.firstName}` : ""},

Your entry in the ${draw ? `${draw.name ?? "recent"} draw (${formatDate(draw.drawDate)})` : "recent draw"} was selected.

Amount added to your account balance: ${formatCurrency(input.prizeAmount)}

You can view this in your dashboard and request a withdrawal

If anything looks off, reply to this email and we'll help sort it out.

Spinworld`,
      });

      // sendMail can resolve successfully even when the recipient was
      // rejected — that shows up here, not as a thrown error.
      console.log("Winner notification email result:", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });
    }
  } catch (err) {
    // Swallow — the winner record and balance credit already succeeded —
    // but log it, otherwise a broken mailer fails silently forever.
    console.error("Failed to send winner notification email:", err);
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

const RESEND_BATCH_SIZE = 100; // Resend's batch endpoint caps at 100 emails per call.

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
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

  // IMPORTANT: don't pass all recipients into one `to` array — that puts
  // every address in the same To field, so every recipient can see every
  // other recipient's email. Resend's batch endpoint sends each email
  // individually (each recipient only ever sees their own address),
  // chunked here since it caps at 100 emails per call.
  const batches = chunk(recipients, RESEND_BATCH_SIZE);
  let sentCount = 0;

  try {
    for (const batch of batches) {
      const { data, error } = await resend.batch.send(
        batch.map((r) => ({
          from,
          to: r.email,
          subject: input.subject,
          text: input.message,
        }))
      );

      if (error) {
        console.error("Resend batch send error:", error);
        return {
          error: `Failed after sending to ${sentCount} of ${recipients.length} recipients: ${error.message}`,
          sent: sentCount,
        };
      }

      sentCount += data?.data?.length ?? batch.length;
    }
  } catch (err) {
    console.error("Failed to send broadcast email:", err);
    return {
      error: `Failed after sending to ${sentCount} of ${recipients.length} recipients.`,
      sent: sentCount,
    };
  }

  return { sent: sentCount };
}