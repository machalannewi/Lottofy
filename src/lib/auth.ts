import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkConfigured } from "@/lib/clerk-config";

type SessionMetadata = { role?: string };

export async function getAuthState(): Promise<{
  userId: string | null;
  isAdmin: boolean;
}> {
  if (!clerkConfigured) return { userId: null, isAdmin: false };

  const { userId, sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata as SessionMetadata | undefined;
  return { userId, isAdmin: metadata?.role === "admin" };
}

export async function getCurrentUser() {
  if (!clerkConfigured) return null;
  return currentUser();
}
