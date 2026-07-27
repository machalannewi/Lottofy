import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Countdown } from "@/components/countdown";
import { getNextUpcomingDraw, getPublicWinners } from "@/lib/data";
import { formatCurrency, maskEmail } from "@/lib/format";
import { Ticket, Calendar, ShieldCheck, Trophy } from "lucide-react";

export default async function HomePage() {
  const [upcomingDraw, winners] = await Promise.all([
    getNextUpcomingDraw(),
    getPublicWinners(),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              100% free ticket entry
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Pick a date. Generate your ticket.
              <span className="text-primary"> That&apos;s it.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Lottofy gives everyone a free shot at the draw. No payment, no
              catch — just generate your ticket and wait for the results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="/dashboard" />}>
                <Ticket className="h-4 w-4" />
                Generate my ticket
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/draws" />}>
                View draws
              </Button>
            </div>
          </div>

          <Card className="border-primary/20 bg-card/60">
            <CardContent className="flex flex-col gap-6 p-6">
              {upcomingDraw ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Next draw prize pool
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(upcomingDraw.prizeAmount)}
                    </p>
                  </div>
                  <Countdown target={upcomingDraw.drawDate} />
                </>
              ) : (
                <p className="text-muted-foreground">
                  No upcoming draw scheduled yet. Check back soon.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: "1. Pick a draw",
                desc: "Choose the upcoming draw date you want to enter.",
              },
              {
                icon: Ticket,
                title: "2. Generate a ticket",
                desc: "We instantly generate a unique free ticket for you.",
              },
              {
                icon: ShieldCheck,
                title: "3. Wait for results",
                desc: "Winners are picked and posted after the draw closes.",
              },
            ].map((step) => (
              <Card key={step.title}>
                <CardContent className="flex flex-col items-start gap-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <Trophy className="h-5 w-5 text-primary" />
              Recent winners
            </h2>
            <Button variant="ghost" render={<Link href="/winners" />}>
              View all
            </Button>
          </div>

          {winners.length === 0 ? (
            <p className="mt-6 text-muted-foreground">
              No winners announced yet — be the first!
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {winners.slice(0, 3).map((winner) => (
                <Card key={winner.id}>
                  <CardContent className="p-5">
                    <p className="font-medium">{maskEmail(winner.user.email)}</p>
                    <p className="text-sm text-muted-foreground">
                      Ticket {winner.ticket.ticketNumber}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-primary">
                      {formatCurrency(winner.prizeAmount)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
