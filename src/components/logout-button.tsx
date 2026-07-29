"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton({
  variant = "outline",
  className,
}: {
  variant?: "outline" | "ghost";
  className?: string;
}) {
  return (
    <SignOutButton redirectUrl="/">
      <Button variant={variant} size="sm" className={className}>
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </SignOutButton>
  );
}
