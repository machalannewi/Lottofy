import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkConfigured } from "@/lib/clerk-config";

export async function getAuthState(): Promise<{
  userId: string | null;
  isAdmin: boolean;
}> {
  if (!clerkConfigured) return { userId: null, isAdmin: false };

  const { userId } = await auth();
  if (!userId) return { userId: null, isAdmin: false };

  // Read the role straight off the user's public metadata rather than
  // sessionClaims.metadata — the latter only works if a custom session
  // token claim ({"metadata": "{{user.public_metadata}}"}) has been added
  // in the Clerk Dashboard, which is an easy-to-miss manual step. This way
  // "set publicMetadata.role = 'admin' on the user" is the only setup
  // needed for admin access to work.
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
  return { userId, isAdmin: role === "admin" };
}

export async function getCurrentUser() {
  if (!clerkConfigured) return null;
  return currentUser();
}
