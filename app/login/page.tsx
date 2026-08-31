"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const t = useTranslations("auth");
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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
        toast.error(body.error ?? t("somethingWrong"));
      }
    } catch {
      toast.error(t("networkError"));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-5" />
        </span>
        <p className="mt-4 text-sm font-medium text-foreground">{t("checkInbox")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.rich("linkSent", {
            email,
            b: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
          })}
        </p>
        <Button variant="ghost" className="mt-4" onClick={() => setSent(false)}>
          {t("useDifferentEmail")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Button
        variant="outline"
        size="lg"
        className="h-11 w-full"
        disabled={googleLoading}
        onClick={() => {
          setGoogleLoading(true);
          void signIn("google", { callbackUrl });
        }}
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GoogleIcon className="size-4" />
        )}
        {t("continueWithGoogle")}
      </Button>

      <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        {t("or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={sendLink} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-9"
            />
          </div>
        </div>
        <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
          {t("sendMagicLink")}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">{t("termsLine")}</p>
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations("auth");
  return (
    <AuthShell title={t("loginTitle")} subtitle={t("loginSubtitle")}>
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
