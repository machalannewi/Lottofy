"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteDrawAction } from "@/app/actions/admin";
import { Trash2 } from "lucide-react";

export function DeleteDrawButton({ drawId }: { drawId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !confirm(
        "Delete this draw? All its tickets and winner records will be removed too. This can't be undone."
      )
    ) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteDrawAction(drawId);
        toast.success("Draw deleted.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete draw.");
      }
    });
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={isPending}
      onClick={handleDelete}
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </Button>
  );
}
