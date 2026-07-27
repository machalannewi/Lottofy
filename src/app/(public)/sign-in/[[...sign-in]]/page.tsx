import { SignIn } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/clerk-config";
import { AuthNotConfigured } from "@/components/auth-not-configured";

export default function SignInPage() {
  if (!clerkConfigured) {
    return <AuthNotConfigured what="Signing in" />;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <SignIn />
    </div>
  );
}
