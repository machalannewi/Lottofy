import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateDrawDialog } from "@/components/admin/create-draw-dialog";
import { getAllDraws } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function AdminDrawsPage() {
  const draws = await getAllDraws();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Draws</h1>
          <p className="mt-1 text-muted-foreground">
            Create draws and manage participants.
          </p>
        </div>
        <CreateDrawDialog />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Draw date</TableHead>
              <TableHead>Prize</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draws.map((draw) => (
              <TableRow key={draw.id}>
                <TableCell className="font-medium">
                  {formatDate(draw.drawDate)}
                </TableCell>
                <TableCell>{formatCurrency(draw.prizeAmount)}</TableCell>
                <TableCell>
                  <Badge variant={draw.status === "UPCOMING" ? "default" : "secondary"}>
                    {draw.status === "UPCOMING" ? "Upcoming" : "Completed"}
                  </Badge>
                </TableCell>
                <TableCell>{draw._count.tickets}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" render={<Link href={`/admin/draws/${draw.id}`} />}>
                    View participants
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {draws.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No draws yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
