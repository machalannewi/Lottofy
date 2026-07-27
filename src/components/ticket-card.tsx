import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

export function TicketCard({
  ticketNumber,
  numbers,
  drawDate,
}: {
  ticketNumber: string;
  numbers: number[];
  drawDate: Date | string;
}) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
      <CardContent className="p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Your ticket
        </p>
        <p className="mt-1 font-mono text-2xl font-bold text-primary">
          {ticketNumber}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Draw date: {formatDate(drawDate)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {numbers.map((n, i) => (
            <span
              key={i}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              {n}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
