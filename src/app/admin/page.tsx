import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminOverviewStats } from "@/lib/data";
import { formatCurrency, formatDate, getDrawName } from "@/lib/format";
import { Users, Ticket, CalendarClock, Trophy } from "lucide-react";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  const cards = [
    {
      label: "Total users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      label: "Tickets today",
      value: stats.ticketsToday.toLocaleString(),
      icon: Ticket,
    },
    {
      label: "Total winners",
      value: stats.totalWinners.toLocaleString(),
      icon: Trophy,
    },
    {
      label: "Next draw",
      value: stats.upcomingDraw ? formatDate(stats.upcomingDraw.drawDate) : "None scheduled",
      icon: CalendarClock,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      <p className="mt-1 text-muted-foreground">
        A snapshot of Lottofy activity.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <card.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.upcomingDraw && (
        <Card className="mt-6">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming draw</p>
              <p className="text-lg font-semibold">
                {getDrawName(stats.upcomingDraw)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(stats.upcomingDraw.drawDate)} &middot;{" "}
                {formatCurrency(stats.upcomingDraw.prizeAmount)}
              </p>
            </div>
            <Button render={<Link href={`/admin/draws/${stats.upcomingDraw.id}`} />}>
              View participants
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" render={<Link href="/admin/draws" />}>
          Manage draws
        </Button>
        <Button variant="outline" render={<Link href="/admin/users" />}>
          Manage users
        </Button>
        <Button variant="outline" render={<Link href="/admin/winners" />}>
          Review winners
        </Button>
        <Button variant="outline" render={<Link href="/admin/email" />}>
          Send broadcast
        </Button>
      </div>
    </div>
  );
}
