import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { clerkConfigured } from "@/lib/clerk-config";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader clerkConfigured={clerkConfigured} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
