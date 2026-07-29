"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { Wallet } from "lucide-react";

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@lottofy.com";

export function WithdrawalCard({ balance }: { balance: number }) {
  const [open, setOpen] = useState(false);

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Withdrawal request"
  )}&body=${encodeURIComponent(
    `Hi Lottofy team,\n\nI'd like to withdraw my balance of ${formatCurrency(
      balance
    )}.\n\nPlease let me know what you need from me to process this.\n\nThanks,`
  )}`;

  return (
    <>
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4" />
              Account balance
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {formatCurrency(balance)}
            </p>
          </div>
          <Button disabled={balance <= 0} onClick={() => setOpen(true)}>
            Withdraw
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a withdrawal</DialogTitle>
            <DialogDescription>
              You have {formatCurrency(balance)} available. To withdraw,
              contact our support team and they&apos;ll take it from there.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button render={<a href={mailtoHref} />}>
              Email {SUPPORT_EMAIL}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
