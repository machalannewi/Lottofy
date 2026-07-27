import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export function AuthNotConfigured({ what }: { what: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4">
      <Alert>
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Authentication isn&apos;t configured yet</AlertTitle>
        <AlertDescription>
          {what} needs Clerk. Add{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
          </code>{" "}
          and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            CLERK_SECRET_KEY
          </code>{" "}
          to your <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code>{" "}
          file (from dashboard.clerk.com) and restart the dev server.
        </AlertDescription>
      </Alert>
    </div>
  );
}
