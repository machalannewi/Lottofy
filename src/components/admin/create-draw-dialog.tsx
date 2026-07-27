"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createDrawAction } from "@/app/actions/admin";
import { Plus } from "lucide-react";

export function CreateDrawDialog() {
  const [open, setOpen] = useState(false);
  const [drawDate, setDrawDate] = useState("");
  const [prizeAmount, setPrizeAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!drawDate || !prizeAmount) return;

    startTransition(async () => {
      try {
        await createDrawAction({
          drawDate,
          prizeAmount: Number(prizeAmount),
        });
        toast.success("Draw created.");
        setOpen(false);
        setDrawDate("");
        setPrizeAmount("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create draw.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4" />
        New draw
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new draw</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="drawDate">Draw date &amp; time</Label>
            <Input
              id="drawDate"
              type="datetime-local"
              value={drawDate}
              onChange={(e) => setDrawDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prizeAmount">Prize amount (NGN)</Label>
            <Input
              id="prizeAmount"
              type="number"
              min="0"
              step="1000"
              value={prizeAmount}
              onChange={(e) => setPrizeAmount(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create draw"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
