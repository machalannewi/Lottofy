import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublicWinners } from "@/lib/data";
import {
  formatCurrency,
  formatDate,
  getDrawName,
  maskEmail,
} from "@/lib/format";
import { Trophy } from "lucide-react";

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  CLAIMED: "Claimed",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default async function WinnersPage() {
  const winners = await getPublicWinners();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
        <Trophy className="h-7 w-7 text-primary" />
        Winners
      </h1>
      <p className="mt-2 text-muted-foreground">
        Recent winners across all Spinworld draws.
      </p>

      <div className="mt-8 space-y-4">
        {winners.length === 0 && (
          <p className="text-muted-foreground">
            No winners announced yet — check back after the next draw.
          </p>
        )}

        {winners.map((winner) => (
          <Card key={winner.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">{maskEmail(winner.user.email)}</p>
                <p className="text-sm text-muted-foreground">
                  Ticket {winner.ticket.ticketNumber} &middot;{" "}
                  {getDrawName(winner.draw)} ({formatDate(winner.draw.drawDate)}
                  )
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(winner.prizeAmount)}
                </p>
                <Badge variant="secondary">{statusLabel[winner.status]}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
