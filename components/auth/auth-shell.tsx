import type { ReactNode } from "react";
import { CheckCircle2, MessageSquareText, ShieldCheck, TriangleAlert } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const highlights = [
  {
    icon: MessageSquareText,
    title: "Real ownership reviews",
    body: "Rated by how long people have actually lived with the product.",
  },
  {
    icon: TriangleAlert,
    title: "Problems, out in the open",
    body: "See the faults owners hit — and when they started.",
  },
  {
    icon: CheckCircle2,
    title: "Fixes that worked",
    body: "Solutions ranked by the people they actually helped.",
  },
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col lg:flex-row">
      {/* Brand / value panel */}
      <section className="relative hidden overflow-hidden bg-primary px-12 py-14 text-primary-foreground lg:flex lg:w-[46%] lg:flex-col lg:justify-between">
        <div className="brand-grid pointer-events-none absolute inset-0 opacity-10" />
        <div className="relative">
          <BrandLogo href="/" className="[&_span]:text-primary-foreground" />
          <h2 className="mt-14 max-w-sm text-3xl font-semibold leading-tight tracking-tight">
            Learn from people who own the product.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/80">
            Structured, searchable experiences from real owners in Bangladesh — not
            lost in a feed.
          </p>
        </div>

        <ul className="relative mt-12 space-y-4">
          {highlights.map(({ icon: Icon, title: t, body }) => (
            <li
              key={t}
              className="flex gap-3 rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm"
            >
              <Icon className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t}</p>
                <p className="text-xs text-primary-foreground/75">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="relative flex items-center gap-2 text-xs text-primary-foreground/70">
          <ShieldCheck className="size-4" />
          Sign-in is passwordless. We never see your Google password.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
