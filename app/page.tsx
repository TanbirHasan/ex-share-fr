import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-black">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
        ExperienceHub
      </p>
      <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        Real product experiences from real owners in Bangladesh.
      </h1>
      <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
        Reviews, problems, and fixes that actually worked — structured and
        searchable, not lost in a feed.
      </p>

      <div className="mt-8 flex items-center gap-3">
        {session?.user ? (
          <Link
            href="/dashboard"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Go to your account
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Sign in
          </Link>
        )}
      </div>

      {session?.user && (
        <p className="mt-4 text-xs text-zinc-400">
          Signed in as {session.user.email} · role {session.user.role}
        </p>
      )}
    </main>
  );
}
