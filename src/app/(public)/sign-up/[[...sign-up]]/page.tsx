import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { clerkConfigured } from "@/lib/clerk-config";
import { AuthNotConfigured } from "@/components/auth-not-configured";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Ticket } from "lucide-react";

export default function SignUpPage() {
  if (!clerkConfigured) {
    return <AuthNotConfigured what="Signing up" />;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Ticket className="h-5 w-5" />
            </span>
            <h1 className="mt-3 text-xl font-semibold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Join Lottofy and generate your free ticket.
            </p>
          </div>
          <SignUpForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
