import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PickWinnerButton } from "@/components/admin/pick-winner-button";
import { getDrawWithParticipants } from "@/lib/data";
import { formatCurrency, formatDate, getDrawName } from "@/lib/format";

export default async function AdminDrawDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const draw = await getDrawWithParticipants(id);
  if (!draw) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{getDrawName(draw)}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{formatDate(draw.drawDate)}</p>

      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center gap-6 p-5">
          <div>
            <p className="text-sm text-muted-foreground">Prize</p>
            <p className="font-semibold text-primary">
              {formatCurrency(draw.prizeAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={draw.status === "UPCOMING" ? "default" : "secondary"}>
              {draw.status === "UPCOMING" ? "Upcoming" : "Completed"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="font-semibold">{draw.tickets.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Winners so far</p>
            <p className="font-semibold">{draw.winners.length}</p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        Pick as many winners as you like — selecting one doesn&apos;t
        prevent picking others.
      </p>
      <h2 className="mt-2 text-lg font-semibold">Participants</h2>
      <div className="mt-3 overflow-x-auto rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Numbers</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Entered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draw.tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono">{ticket.ticketNumber}</TableCell>
                <TableCell>{ticket.numbers.join(", ")}</TableCell>
                <TableCell>{ticket.user.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(ticket.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  {ticket.winner ? (
                    <Badge>Winner</Badge>
                  ) : (
                    <PickWinnerButton
                      ticketId={ticket.id}
                      drawId={draw.id}
                      userId={ticket.userId}
                      prizeAmount={draw.prizeAmount}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {draw.tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No participants yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
