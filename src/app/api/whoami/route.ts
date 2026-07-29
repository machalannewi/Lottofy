import { NextResponse } from "next/server";
import { clerkConfigured } from "@/lib/clerk-config";
import { auth, currentUser } from "@clerk/nextjs/server";

// Temporary debug endpoint: visit /api/whoami while signed in to see
// exactly what the server thinks your userId and publicMetadata are.
// Safe to delete once the admin-role issue is confirmed fixed — it only
// ever reveals the metadata of whoever is currently signed in, nothing else.
export async function GET() {
  if (!clerkConfigured) {
    return NextResponse.json({ error: "Clerk isn't configured." }, { status: 200 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ signedIn: false }, { status: 200 });
  }

  const user = await currentUser();

  return NextResponse.json({
    signedIn: true,
    userId,
    primaryEmail: user?.emailAddresses?.[0]?.emailAddress ?? null,
    publicMetadata: user?.publicMetadata ?? null,
    isAdminPerServer: (user?.publicMetadata as { role?: string } | undefined)?.role === "admin",
  });
}
