"use server";

import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export type VoteResult = {
  ok: boolean;
  helpfulCount?: number;
  voted?: boolean;
  error?: string;
};

export async function toggleHelpful(
  reviewId: string,
  currentlyVoted: boolean,
): Promise<VoteResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to mark reviews helpful." };

  try {
    const r = await apiSend<{ helpfulCount: number; viewerHasVoted: boolean }>(
      `/api/v1/reviews/${reviewId}/vote`,
      currentlyVoted ? "DELETE" : "POST",
    );
    return { ok: true, helpfulCount: r.helpfulCount, voted: r.viewerHasVoted };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not record your vote.",
    };
  }
}
