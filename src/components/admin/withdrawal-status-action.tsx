"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setWithdrawalStatusAction } from "@/app/actions/admin";

export function WithdrawalStatusAction({
  requestId,
  status,
}: {
  requestId: string;
  status: "PENDING" | "PROCESSED";
}) {
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      try {
        const next = status === "PENDING" ? "PROCESSED" : "PENDING";
        await setWithdrawalStatusAction(requestId, next);
        toast.success(
          next === "PROCESSED" ? "Marked as processed." : "Marked as pending."
        );
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update request."
        );
      }
    });
  }

  return (
    <Button size="sm" variant="outline" disabled={isPending} onClick={toggle}>
      {status === "PENDING" ? "Mark processed" : "Mark pending"}
    </Button>
  );
}
