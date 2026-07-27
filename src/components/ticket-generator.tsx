"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/ticket-card";
import { generateTicketAction } from "@/app/actions/tickets";
import { Ticket as TicketIcon } from "lucide-react";

type Ticket = {
  ticketNumber: string;
  numbers: number[];
};

export function TicketGenerator({
  drawId,
  drawDate,
  initialTicket,
}: {
  drawId: string;
  drawDate: Date | string;
  initialTicket: Ticket | null;
}) {
  const [ticket, setTicket] = useState<Ticket | null>(initialTicket);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateTicketAction(drawId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.ticket) {
        setTicket(result.ticket);
        toast.success("Ticket generated! Good luck.");
      }
    });
  }

  if (ticket) {
    return (
      <TicketCard
        ticketNumber={ticket.ticketNumber}
        numbers={ticket.numbers}
        drawDate={drawDate}
      />
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border p-6">
      <p className="text-muted-foreground">
        You don&apos;t have a ticket for this draw yet.
      </p>
      <Button onClick={handleGenerate} disabled={isPending} size="lg">
        <TicketIcon className="h-4 w-4" />
        {isPending ? "Generating..." : "Generate my free ticket"}
      </Button>
    </div>
  );
}
