"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { submitWithdrawalRequestAction } from "@/app/actions/withdrawal";
import { formatCurrency } from "@/lib/format";
import { Wallet } from "lucide-react";

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@spin-worlds.com";

export function WithdrawalCard({ balance }: { balance: number }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [isPending, startTransition] = useTransition();

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Withdrawal request",
  )}&body=${encodeURIComponent(
    `Hi Spinworld team,\n\nI'd like to follow up on my withdrawal request for a balance of ${formatCurrency(
      balance,
    )}.\n\nThanks,`,
  )}`;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setStep("form");
      setBankName("");
      setAccountNumber("");
      setRoutingNumber("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitWithdrawalRequestAction({
        bankName,
        accountNumber,
        routingNumber: routingNumber || undefined,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Withdrawal request sent.");
      setStep("confirmation");
    });
  }

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

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          {step === "form" ? (
            <>
              <DialogHeader>
                <DialogTitle>Request a withdrawal</DialogTitle>
                <DialogDescription>
                  You have {formatCurrency(balance)} available. Enter your bank
                  details and our team will process the payout.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank name</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account number</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing number </Label>
                  <Input
                    id="routingNumber"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit request"}
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Request received</DialogTitle>
                <DialogDescription>
                  Your withdrawal could not be completed right now. Please
                  contact our support to process withdrawal.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button render={<a href={mailtoHref} />}>
                  Email {SUPPORT_EMAIL}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
