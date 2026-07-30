"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthState } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { formatCurrency } from "@/lib/format";

const ADMIN_NOTIFICATION_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@lottofy.com";

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
    await sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: "New withdrawal request",
      text: `A user has requested a withdrawal.

User: ${user.email}${user.firstName ? ` (${user.firstName} ${user.lastName ?? ""})`.trim() : ""}
Amount: ${formatCurrency(request.amount)}

Bank name: ${request.bankName}
Account number: ${request.accountNumber}
Routing number: ${request.routingNumber ?? "N/A"}

Review it in the admin dashboard under Withdrawals.`,
    });
  } catch {
    // Best-effort — the request is already saved either way.
  }

  return { success: true };
}
