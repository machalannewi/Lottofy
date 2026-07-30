"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthState } from "@/lib/auth";
import { getMailer } from "@/lib/email";
import { formatCurrency } from "@/lib/format";

export async function submitWithdrawalRequestAction(input: {
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
}) {
  const { userId } = await getAuthState();
  if (!userId) {
    return { error: "You must be signed in to request a withdrawal." };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "Could not load your account." };
  }
  if (user.balance <= 0) {
    return { error: "You don't have a balance available to withdraw." };
  }
  if (!input.bankName.trim() || !input.accountNumber.trim()) {
    return { error: "Bank name and account number are required." };
  }

  const request = await prisma.withdrawalRequest.create({
    data: {
      userId,
      amount: user.balance,
      bankName: input.bankName.trim(),
      accountNumber: input.accountNumber.trim(),
      routingNumber: input.routingNumber?.trim() || null,
    },
  });

  revalidatePath("/admin/withdrawals");

  try {
    const transporter = getMailer();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "New withdrawal request",
      text: `A user has requested a withdrawal.

User: ${user.email}${user.firstName ? ` (${user.firstName} ${user.lastName ?? ""})`.trim() : ""}
Amount: ${formatCurrency(request.amount)}

Bank name: ${request.bankName}
Account number: ${request.accountNumber}
Routing number: ${request.routingNumber ?? "N/A"}

Review it in the admin dashboard under Withdrawals.`,
    });
  } catch (err) {
    // Best-effort — the request is already saved either way, but we still
    // need to know WHY the email failed instead of swallowing it silently.
    console.error("Failed to send withdrawal notification email:", err);
  }

  return { success: true };
}