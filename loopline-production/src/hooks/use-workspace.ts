"use client";

import { useSession } from "next-auth/react";

export function useWorkspaceId(): string | undefined {
  const { data: session } = useSession();
  // @ts-expect-error workspaceId is augmented on session.user in lib/auth.ts
  return session?.user?.workspaceId;
}
