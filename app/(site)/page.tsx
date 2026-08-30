import Link from "next/link";
import {
  AirVent,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Fan,
  Headphones,
  Lightbulb,
  Microwave,
  MoreHorizontal,
  Refrigerator,
  Search,
  Smartphone,
  Sparkles,
  Star,
  ThumbsUp,
  TriangleAlert,
  Tv,
  WashingMachine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const popularSearches = [
  "Walton Refrigerator",
  "Samsung TV",
  "LG AC",
  "Washing Machine Noise",
];

const categories = [
  { label: "Refrigerators", icon: Refrigerator, href: "/products?category=refrigerator" },
  { label: "Televisions", icon: Tv, href: "/products?category=television" },
  { label: "Air Conditioners", icon: AirVent, href: "/products?category=air-conditioner" },
  { label: "Fans", icon: Fan, href: "/products?category=fan" },
  { label: "Washing Machines", icon: WashingMachine, href: "/products?category=washing-machine" },
  { label: "Kitchen", icon: Microwave, href: "/products?category=kitchen" },
  { label: "Mobiles", icon: Smartphone, href: "/products?category=mobile" },
  { label: "Audio", icon: Headphones, href: "/products?category=audio" },
];

const stats = [
  { label: "Reviews", value: "12,458", icon: Star },
  { label: "Problems reported", value: "2,187", icon: TriangleAlert },
  { label: "Solutions shared", value: "3,645", icon: Lightbulb },
  { label: "Contributors", value: "8,921", icon: ThumbsUp },
];

const trending = [
  {
    name: "Walton Smart Fridge WNM-2A3",
    rating: 4.3,
    reviews: 512,
    price: "৳38,500 – 42,000",
    flag: null as string | null,
  },
  {
    name: "Samsung 55\" Crystal UHD 4K",
    rating: 4.5,
    reviews: 1200,
    price: "৳72,000 – 78,000",
    flag: null,
  },
  {
    name: "Gree 1.5 Ton Inverter AC",
    rating: 4.4,
    reviews: 842,
    price: "৳52,000 – 56,000",
    flag: "Compressor noise reported",
  },
  {
    name: "LG Front Load Washer 8kg",
    rating: 4.2,
    reviews: 632,
    price: "৳45,000 – 48,000",
    flag: null,
  },
];

const valueProps = [
  {
    icon: ThumbsUp,
    title: "Real experiences",
    body: "Honest, long-term feedback from people who own the product.",
  },
  {
    icon: TriangleAlert,
    title: "Common problems",
    body: "Know the faults and when they start — before you buy.",
  },
  {
    icon: Lightbulb,
    title: "Helpful solutions",
    body: "Fixes ranked by the people they actually worked for.",
  },
  {
    icon: BadgeCheck,
    title: "Better decisions",
    body: "Compare on reliability and after-sales, not just specs.",
  },
];

const activity = [
  { icon: Star, text: "A user reviewed Samsung 43\" LED TV", time: "2 minutes ago", tone: "primary" },
  { icon: TriangleAlert, text: "New problem reported for Walton Refrigerator", time: "15 minutes ago", tone: "amber" },
  { icon: Lightbulb, text: "A solution was shared for “LG AC not cooling”", time: "28 minutes ago", tone: "emerald" },
  { icon: ThumbsUp, text: "42 people found a Gree AC review helpful", time: "1 hour ago", tone: "primary" },
];

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/[0.06] to-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Real People → Real Experiences → Better Decisions
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Find products.{" "}
              <span className="text-primary">Learn from real experiences.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              Read honest reviews, discover common problems, and find helpful
              solutions from real owners across Bangladesh.
            </p>

            <form action="/search" className="mt-7 flex max-w-xl gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search product, model, brand or problem…"
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6">
                Search
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Popular:</span>
              {popularSearches.map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Community card */}
          <Card className="self-start">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Community at a glance
                </h2>
                <Badge variant="secondary" className="gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Live
                </Badge>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl border bg-muted/40 p-4">
                    <Icon className="size-4 text-primary" />
                    <dd className="mt-2 text-xl font-semibold text-foreground tabular-nums">
                      {value}
                    </dd>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
                <p className="text-xs font-medium opacity-90">This week</p>
                <p className="text-sm">
                  318 new experiences added across refrigerators & ACs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <SectionHeading title="Browse by category" href="/products" cta="View all" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
              <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <SectionHeading title="Trending products" href="/products?sort=trending" cta="View all" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((p) => (
              <Card key={p.name} className="overflow-hidden">
                <div className="flex aspect-[4/3] items-center justify-center bg-muted text-muted-foreground">
                  <MoreHorizontal className="size-6" />
                </div>
                <CardContent className="p-4">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-foreground">
                    {p.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Stars value={p.rating} />
                    <span className="text-xs text-muted-foreground">
                      ({p.reviews.toLocaleString()})
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground tabular-nums">
                    {p.price}
                  </p>
                  {p.flag && (
                    <Badge
                      variant="secondary"
                      className="mt-3 gap-1 text-amber-700 dark:text-amber-400"
                    >
                      <TriangleAlert className="size-3" />
                      {p.flag}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity + CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionHeading title="Recent community activity" href="/activity" cta="View all" />
            <ul className="mt-6 divide-y rounded-xl border bg-card">
              {activity.map(({ icon: Icon, text, time, tone }) => (
                <li key={text} className="flex items-center gap-3 p-4">
                  <span
                    className={
                      "flex size-9 shrink-0 items-center justify-center rounded-lg " +
                      (tone === "amber"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : tone === "emerald"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-primary/10 text-primary")
                    }
                  >
                    <Icon className="size-4" />
                  </span>
                  <p className="text-sm text-foreground">{text}</p>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="self-center bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <CheckCircle2 className="size-7" />
              <h3 className="mt-4 text-xl font-semibold">Own one of these products?</h3>
              <p className="mt-2 text-sm text-primary-foreground/85">
                Your experience — good or bad — helps the next person choose with
                confidence. It takes under a minute.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href="/contribute">
                  Share your experience <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {cta} <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
