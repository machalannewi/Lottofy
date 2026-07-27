"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setWinnerStatusAction } from "@/app/actions/admin";

export function WinnerStatusActions({
  winnerId,
  status,
}: {
  winnerId: string;
  status: "PENDING" | "CLAIMED" | "APPROVED" | "REJECTED";
}) {
  const [isPending, startTransition] = useTransition();

  function setStatus(next: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      try {
        await setWinnerStatusAction(winnerId, next);
        toast.success(next === "APPROVED" ? "Winner approved." : "Winner rejected.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update winner.");
      }
    });
  }

  if (status === "APPROVED") {
    return (
      <Button size="sm" variant="outline" disabled={isPending} onClick={() => setStatus("REJECTED")}>
        Revoke
      </Button>
    );
  }

  if (status === "REJECTED") {
    return (
      <Button size="sm" variant="outline" disabled={isPending} onClick={() => setStatus("APPROVED")}>
        Approve
      </Button>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" disabled={isPending} onClick={() => setStatus("APPROVED")}>
        Approve
      </Button>
      <Button size="sm" variant="destructive" disabled={isPending} onClick={() => setStatus("REJECTED")}>
        Reject
      </Button>
    </div>
  );
}
