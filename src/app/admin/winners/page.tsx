import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WinnerStatusActions } from "@/components/admin/winner-status-actions";
import { getAllWinners } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  CLAIMED: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default async function AdminWinnersPage() {
  const winners = await getAllWinners();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Winners</h1>
      <p className="mt-1 text-muted-foreground">
        Approve or reject prize claims before they show publicly.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Draw</TableHead>
              <TableHead>Prize</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {winners.map((winner) => (
              <TableRow key={winner.id}>
                <TableCell className="font-mono">
                  {winner.ticket.ticketNumber}
                </TableCell>
                <TableCell>{winner.user.email}</TableCell>
                <TableCell>{formatDate(winner.draw.drawDate)}</TableCell>
                <TableCell>{formatCurrency(winner.prizeAmount)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[winner.status]}>
                    {winner.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <WinnerStatusActions winnerId={winner.id} status={winner.status} />
                </TableCell>
              </TableRow>
            ))}
            {winners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No winners yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
