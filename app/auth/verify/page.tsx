import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { ArrowRight, KeyRound, TriangleAlert } from "lucide-react";
import { signIn } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;

  if (!email || !token) {
    return (
      <AuthShell title="Broken link" subtitle="This sign-in link is missing information.">
        <div className="rounded-xl border bg-card p-6 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" />
          </span>
          <p className="mt-4 text-sm text-muted-foreground">
            Request a fresh link and try again.
          </p>
          <Button asChild className="mt-4">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  async function verify() {
    "use server";
    try {
      await signIn("magic-link", { email, token, redirectTo: "/dashboard" });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=invalid-link");
      }
      throw error; // let the success redirect propagate
    }
  }

  return (
    <AuthShell title="Confirm sign-in" subtitle={`Continue as ${email}`}>
      <form action={verify} className="rounded-xl border bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-5" />
        </span>
        <p className="mt-4 text-sm text-muted-foreground">
          For your security, confirm you opened this link yourself.
        </p>
        <Button type="submit" size="lg" className="mt-5 h-11 w-full">
          <ArrowRight className="size-4" />
          Continue
        </Button>
      </form>
    </AuthShell>
  );
}
