import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthError } from "next-auth";
import { ArrowRight, KeyRound, TriangleAlert } from "lucide-react";
import { signIn } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { safeCallbackUrl } from "@/lib/safe-redirect";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string; callbackUrl?: string }>;
}) {
  const { email, token, callbackUrl } = await searchParams;
  const t = await getTranslations("auth");
  const redirectTo = safeCallbackUrl(callbackUrl);

  if (!email || !token) {
    return (
      <AuthShell title={t("brokenLinkTitle")} subtitle={t("brokenLinkSubtitle")}>
        <div className="rounded-xl border bg-card p-6 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" />
          </span>
          <p className="mt-4 text-sm text-muted-foreground">{t("brokenLinkBody")}</p>
          <Button asChild className="mt-4">
            <Link href="/login">{t("backToSignIn")}</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  async function verify() {
    "use server";
    try {
      await signIn("magic-link", { email, token, redirectTo });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=invalid-link");
      }
      throw error; // let the success redirect propagate
    }
  }

  return (
    <AuthShell title={t("confirmTitle")} subtitle={t("confirmSubtitle", { email })}>
      <form action={verify} className="rounded-xl border bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-5" />
        </span>
        <p className="mt-4 text-sm text-muted-foreground">{t("confirmBody")}</p>
        <Button type="submit" size="lg" className="mt-5 h-11 w-full">
          <ArrowRight className="size-4" />
          {t("continue")}
        </Button>
      </form>
    </AuthShell>
  );
}
