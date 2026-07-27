import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { clerkConfigured } from "@/lib/clerk-config";
import { Ticket } from "lucide-react";

const navLinks = [
  { href: "/draws", label: "Draws" },
  { href: "/winners", label: "Winners" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="h-4 w-4" />
          </span>
          <span className="text-lg">Lottofy</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {clerkConfigured ? (
            <>
              <Show when="signed-out">
                <Button variant="ghost" render={<Link href="/sign-in" />}>
                  Sign in
                </Button>
                <Button render={<Link href="/sign-up" />}>Get a ticket</Button>
              </Show>
              <Show when="signed-in">
                <Button variant="ghost" render={<Link href="/dashboard" />}>
                  Dashboard
                </Button>
                <UserButton />
              </Show>
            </>
          ) : (
            <Button render={<Link href="/dashboard" />}>Dashboard</Button>
          )}
        </div>
      </div>
    </header>
  );
}
