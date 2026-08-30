"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function Verifier() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const email = params.get("email");
    const token = params.get("token");
    if (!email || !token) {
      setError("This link is missing information.");
      return;
    }

    void signIn("magic-link", { email, token, redirect: false }).then((res) => {
      if (res?.ok) router.replace("/dashboard");
      else setError("This sign-in link is invalid or has expired.");
    });
  }, [params, router]);

  return (
    <div className="text-center">
      {error ? (
        <>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <a href="/login" className="mt-2 inline-block text-sm underline">
            Back to sign in
          </a>
        </>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Signing you in…</p>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <Verifier />
      </Suspense>
    </main>
  );
}
