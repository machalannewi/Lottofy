import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllDraws } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function DrawsPage() {
  const draws = await getAllDraws();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Draws</h1>
      <p className="mt-2 text-muted-foreground">
        Every upcoming and past draw, and how many tickets were generated.
      </p>

      <div className="mt-8 space-y-4">
        {draws.length === 0 && (
          <p className="text-muted-foreground">No draws scheduled yet.</p>
        )}

        {draws.map((draw) => (
          <Card key={draw.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{formatDate(draw.drawDate)}</p>
                  <Badge
                    variant={
                      draw.status === "UPCOMING" ? "default" : "secondary"
                    }
                  >
                    {draw.status === "UPCOMING" ? "Upcoming" : "Completed"}
                  </Badge>
                  <Badge variant={draw.isFree ? "secondary" : "outline"}>
                    {draw.isFree
                      ? "Free"
                      : `${formatCurrency(draw.entryAmount)} entry`}
                  </Badge>
                </div>
                {/* <p className="text-sm text-muted-foreground">
                  {draw._count.tickets} ticket
                  {draw._count.tickets === 1 ? "" : "s"} generated
                </p> */}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(draw.prizeAmount)}
                </p>
                {draw.status === "UPCOMING" && (
                  <Button size="sm" render={<Link href="/dashboard" />}>
                    Get a ticket
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
