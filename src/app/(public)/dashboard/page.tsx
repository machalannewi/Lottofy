import { redirect } from "next/navigation";
import { clerkConfigured } from "@/lib/clerk-config";
import { getAuthState } from "@/lib/auth";
import {
  getUpcomingDraws,
  getUserTickets,
  getUserTicketForDraw,
  ensureUserExists,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { AuthNotConfigured } from "@/components/auth-not-configured";
import { TicketGenerator } from "@/components/ticket-generator";
import { WithdrawalCard } from "@/components/withdrawal-card";
import { Countdown } from "@/components/countdown";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function DashboardPage() {
  if (!clerkConfigured) {
    return <AuthNotConfigured what="Your dashboard" />;
  }

  const { userId } = await getAuthState();
  if (!userId) redirect("/sign-in");

  const clerkUser = await getCurrentUser();
  const metadata = clerkUser?.unsafeMetadata as
    | { phone?: string; country?: string }
    | undefined;
  const dbUser = await ensureUserExists(
    userId,
    clerkUser?.emailAddresses[0]?.emailAddress ?? "",
    {
      firstName: clerkUser?.firstName,
      lastName: clerkUser?.lastName,
      phone: metadata?.phone,
      country: metadata?.country,
    }
  );

  const [upcomingDraws, pastTickets] = await Promise.all([
    getUpcomingDraws(),
    getUserTickets(userId),
  ]);

  const drawsWithTickets = await Promise.all(
    upcomingDraws.map(async (draw) => ({
      draw,
      ticket: await getUserTicketForDraw(userId, draw.id),
    }))
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ""}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Generate your free ticket for the next draw.
      </p>

      <div className="mt-8">
        <WithdrawalCard balance={dbUser.balance} />
      </div>

      {drawsWithTickets.length > 0 ? (
        <div className="mt-8 space-y-10">
          {drawsWithTickets.map(({ draw, ticket }) => (
            <div key={draw.id} className="space-y-6">
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-6 p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Draw</p>
                      <Badge variant={draw.isFree ? "secondary" : "outline"}>
                        {draw.isFree
                          ? "Free"
                          : `${formatCurrency(draw.entryAmount)} entry`}
                      </Badge>
                    </div>
                    <p className="text-xl font-semibold">
                      {formatDate(draw.drawDate)}
                    </p>
                    <p className="mt-1 text-primary font-semibold">
                      {formatCurrency(draw.prizeAmount)} prize pool
                    </p>
                  </div>
                  <Countdown target={draw.drawDate} />
                </CardContent>
              </Card>

              <TicketGenerator
                drawId={draw.id}
                drawDate={draw.drawDate}
                initialTicket={ticket}
                isFree={draw.isFree}
                entryAmount={draw.entryAmount}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">
          There&apos;s no upcoming draw right now. Check back soon.
        </p>
      )}

      {pastTickets.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold">Your ticket history</h2>
          <div className="mt-4 space-y-3">
            {pastTickets.map((t) => (
              <Card key={t.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-mono font-medium">{t.ticketNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Draw {formatDate(t.draw.drawDate)}
                    </p>
                  </div>
                  <Badge variant={t.winner ? "default" : "secondary"}>
                    {t.winner ? "Winner!" : t.draw.status === "UPCOMING" ? "Pending draw" : "Not selected"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
