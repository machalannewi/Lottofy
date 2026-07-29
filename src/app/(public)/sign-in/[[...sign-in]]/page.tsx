import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { clerkConfigured } from "@/lib/clerk-config";
import { AuthNotConfigured } from "@/components/auth-not-configured";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Ticket } from "lucide-react";

export default function SignInPage() {
  if (!clerkConfigured) {
    return <AuthNotConfigured what="Signing in" />;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Ticket className="h-5 w-5" />
            </span>
            <h1 className="mt-3 text-xl font-semibold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage your tickets.
            </p>
          </div>
          <SignInForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
