import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { apiFetch } from "@/lib/backend";

type Me = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  reviewCount: number;
  problemCount: number;
  solutionCount: number;
  createdAt: string;
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const res = await apiFetch("/api/v1/me");
  const me: Me | null = res.ok ? await res.json() : null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your account
        </h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="rounded-lg border border-black/[.12] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.16] dark:hover:bg-white/[.06]">
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            NextAuth session
          </h2>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            {JSON.stringify(session.user, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Backend&nbsp;/api/v1/me&nbsp;(verified via bearer token)
          </h2>
          {me ? (
            <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {JSON.stringify(me, null, 2)}
            </pre>
          ) : (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Backend rejected the request (status {res.status}). Check that both
              apps share the same AUTH_SHARED_SECRET and the backend is running.
            </p>
          )}
        </div>

        {me?.role === "admin" && (
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            You are an admin — admin-only API routes will accept this session.
          </p>
        )}
      </section>
    </main>
  );
}
