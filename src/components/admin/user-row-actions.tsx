"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  setUserStatusAction,
  deleteUserAction,
} from "@/app/actions/admin";

export function UserRowActions({
  userId,
  status,
}: {
  userId: string;
  status: "ACTIVE" | "BANNED";
}) {
  const [isPending, startTransition] = useTransition();

  function toggleBan() {
    startTransition(async () => {
      try {
        await setUserStatusAction(userId, status === "ACTIVE" ? "BANNED" : "ACTIVE");
        toast.success(status === "ACTIVE" ? "User banned." : "User unbanned.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update user.");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this user and all their tickets? This can't be undone.")) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteUserAction(userId);
        toast.success("User deleted.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete user.");
      }
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={toggleBan}
      >
        {status === "ACTIVE" ? "Ban" : "Unban"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
}
