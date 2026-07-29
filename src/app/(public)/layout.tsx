import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { clerkConfigured } from "@/lib/clerk-config";
import { getAuthState } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await getAuthState();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader clerkConfigured={clerkConfigured} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
