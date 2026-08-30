"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Something went wrong.");
      }
    } catch {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.12] dark:bg-zinc-950">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Sign in to ExperienceHub
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Reading is open to everyone. Sign in to contribute.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-black/[.12] bg-white text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-white/[.16] dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-zinc-400">
          <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.12]" />
          or
          <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.12]" />
        </div>

        {sent ? (
          <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            Check your email for a sign-in link. In local development it is printed
            in the Next.js server console.
          </p>
        ) : (
          <form onSubmit={sendLink} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-lg border border-black/[.12] bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/[.16] dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {loading ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </main>
  );
}
