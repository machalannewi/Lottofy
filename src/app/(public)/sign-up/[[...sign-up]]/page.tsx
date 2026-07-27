import { SignUp } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/clerk-config";
import { AuthNotConfigured } from "@/components/auth-not-configured";

export default function SignUpPage() {
  if (!clerkConfigured) {
    return <AuthNotConfigured what="Signing up" />;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <SignUp />
    </div>
  );
}
