"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GoogleTranslate } from "@/components/google-translate";
import { useHydrated } from "@/hooks/use-hydrated";
import { Ticket, Menu } from "lucide-react";

const navLinks = [
  { href: "/draws", label: "Draws" },
  { href: "/winners", label: "Winners" },
  { href: "/about", label: "About" },
];

export function SiteHeader({
  clerkConfigured,
  isAdmin,
}: {
  clerkConfigured: boolean;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Clerk's auth state isn't known during SSR, so anything gated by
  // <Show> must render the exact same thing on the server and on the
  // very first client render. useHydrated() returns false for both of
  // those and true afterward — no setState-in-effect involved.
  const hydrated = useHydrated();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="h-4 w-4" />
          </span>
          <span className="text-lg">Spinworld</span>
        </Link>

        {/* Desktop nav — hidden below sm */}
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

        {/* Desktop-only actions */}
        <div className="hidden items-center gap-3 sm:flex">
          {!hydrated ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : clerkConfigured ? (
            <>
              <Show when="signed-out">
                <Button variant="ghost" render={<Link href="/sign-in" />}>
                  Sign in
                </Button>
                <Button render={<Link href="/sign-up" />}>Get a ticket</Button>
              </Show>
              <Show when="signed-in">
                {isAdmin && (
                  <Button variant="ghost" render={<Link href="/admin" />}>
                    Admin
                  </Button>
                )}
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

        {/* Always visible, regardless of breakpoint */}
        <GoogleTranslate />

        {/* Mobile: user button (if signed in) + hamburger trigger */}
        <div className="flex items-center gap-2 sm:hidden">
          {hydrated && clerkConfigured && (
            <Show when="signed-in">
              <UserButton />
            </Show>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-foreground"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />

            <SheetContent
              side="right"
              className="w-72 bg-background text-foreground"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Ticket className="h-3.5 w-3.5" />
                  </span>
                  Spinworld
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 border-t border-border/60 pt-6">
                {!hydrated ? (
                  <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
                ) : clerkConfigured ? (
                  <div className="flex flex-col gap-2">
                    <Show when="signed-out">
                      <Button
                        variant="ghost"
                        render={
                          <Link
                            href="/sign-in"
                            onClick={() => setOpen(false)}
                          />
                        }
                      >
                        Sign in
                      </Button>
                      <Button
                        render={
                          <Link
                            href="/sign-up"
                            onClick={() => setOpen(false)}
                          />
                        }
                      >
                        Get a ticket
                      </Button>
                    </Show>
                    <Show when="signed-in">
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          render={
                            <Link
                              href="/admin"
                              onClick={() => setOpen(false)}
                            />
                          }
                        >
                          Admin
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        render={
                          <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                          />
                        }
                      >
                        Dashboard
                      </Button>
                    </Show>
                  </div>
                ) : (
                  <Button
                    render={
                      <Link href="/dashboard" onClick={() => setOpen(false)} />
                    }
                  >
                    Dashboard
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
