"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { pickWinnerAction } from "@/app/actions/admin";

export function PickWinnerButton({
  ticketId,
  drawId,
  userId,
  prizeAmount,
}: {
  ticketId: string;
  drawId: string;
  userId: string;
  prizeAmount: number;
}) {
  const [isPending, startTransition] = useTransition();

  function handlePick() {
    if (
      !confirm(
        "Mark this ticket as the winner? This will close the draw to further entries."
      )
    ) {
      return;
    }
    startTransition(async () => {
      try {
        await pickWinnerAction({ ticketId, drawId, userId, prizeAmount });
        toast.success("Winner selected.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to select winner.");
      }
    });
  }

  return (
    <Button size="sm" disabled={isPending} onClick={handlePick}>
      {isPending ? "Selecting..." : "Pick as winner"}
    </Button>
  );
}
