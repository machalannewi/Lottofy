"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [name, setName] = useState("");
  const [drawDate, setDrawDate] = useState("");
  const [prizeAmount, setPrizeAmount] = useState("");
  const [entryType, setEntryType] = useState<"free" | "paid">("free");
  const [entryAmount, setEntryAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !drawDate || !prizeAmount) return;
    if (entryType === "paid" && !entryAmount) return;

    startTransition(async () => {
      try {
        await createDrawAction({
          name: name.trim(),
          drawDate,
          prizeAmount: Number(prizeAmount),
          isFree: entryType === "free",
          entryAmount: entryType === "paid" ? Number(entryAmount) : 0,
        });
        toast.success("Draw created.");
        setOpen(false);
        setName("");
        setDrawDate("");
        setPrizeAmount("");
        setEntryType("free");
        setEntryAmount("");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to create draw.",
        );
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
            <Label htmlFor="drawName">Draw name</Label>
            <Input
              id="drawName"
              placeholder="e.g. Independence Day Giveaway"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <Label htmlFor="prizeAmount">Prize amount (USD)</Label>
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
          <div className="space-y-2">
            <Label htmlFor="entryType">Entry type</Label>
            <Select
              value={entryType}
              onValueChange={(v) => setEntryType(v as "free" | "paid")}
            >
              <SelectTrigger id="entryType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free to enter</SelectItem>
                <SelectItem value="paid">Paid entry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {entryType === "paid" && (
            <div className="space-y-2">
              <Label htmlFor="entryAmount">Amount to enter (USD)</Label>
              <Input
                id="entryAmount"
                type="number"
                min="0"
                step="100"
                value={entryAmount}
                onChange={(e) => setEntryAmount(e.target.value)}
                required
              />
            </div>
          )}
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
