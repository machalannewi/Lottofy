import { redirect } from "next/navigation";
import { clerkConfigured } from "@/lib/clerk-config";
import { getAuthState } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (clerkConfigured) {
    const { isAdmin } = await getAuthState();
    if (!isAdmin) redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminMobileNav />
      <AdminSidebar />
      <div className="flex-1">
        {!clerkConfigured && (
          <div className="border-b border-yellow-500/30 bg-yellow-500/10 px-6 py-3">
            <Alert className="border-none bg-transparent p-0">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Dev preview mode</AlertTitle>
              <AlertDescription>
                Clerk isn&apos;t configured, so admin access isn&apos;t
                enforced. Add your Clerk keys before deploying.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
