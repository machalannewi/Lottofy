"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoutButton } from "@/components/logout-button";
import { adminNavLinks } from "@/components/admin/admin-nav-links";
import { Ticket, Menu } from "lucide-react";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b border-border/60 bg-card/30 p-4 md:hidden">
      <Link href="/admin" className="flex items-center gap-2 font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Ticket className="h-4 w-4" />
        </span>
        Spinworld Admin
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open admin menu"
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
              Spinworld Admin
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-1 flex-col gap-1 px-4">
            {adminNavLinks.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border/60 p-4">
            <LogoutButton className="w-full justify-center" />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
