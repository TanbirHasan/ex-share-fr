import Link from "next/link";
import { Headset, Star } from "lucide-react";
import { auth } from "@/auth";
import { ServiceCard } from "@/components/site/service-card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/backend";
import type { Product } from "@/lib/catalog-types";
import {
  REPAIR_OUTCOME,
  RESPONSE_TIME,
  SERVICE_WARRANTY,
  labelFor,
  type ServiceExperience,
  type ServiceList,
} from "@/lib/service-types";

const EMPTY: ServiceList = {
  data: [],
  total: 0,
  limit: 10,
  offset: 0,
  summary: {
    count: 0,
    avgRating: 0,
    avgTechnicianRating: null,
    recommendedRate: 0,
    responseTime: {},
    repairOutcome: {},
    warranty: {},
    medianCost: null,
    medianDurationDays: null,
  },
};

function Dist({
  title,
  data,
  labels,
}: {
  title: string;
  data: Record<string, number>;
  labels: readonly { value: string; label: string }[];
}) {
  const entries = labels.filter((l) => data[l.value]);
  if (entries.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {entries.map((l) => (
          <span key={l.value} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {l.label} · {data[l.value]}
          </span>
        ))}
      </div>
    </div>
  );
}

export async function ServiceSection({ product }: { product: Product }) {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  const [listRes, mineRes] = await Promise.all([
    apiFetch(`/api/v1/products/${product.id}/service?limit=10`),
    signedIn
      ? apiFetch(`/api/v1/products/${product.id}/service/mine`)
      : Promise.resolve(null),
  ]);

  const list: ServiceList = listRes.ok ? await listRes.json() : EMPTY;
  const mine: ServiceExperience | null = mineRes && mineRes.ok ? await mineRes.json() : null;
  const s = list.summary;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Customer service{s.count > 0 ? ` (${s.count})` : ""}
        </h2>
        <Button asChild size="sm" variant={mine ? "outline" : "default"}>
          <Link href={`/contribute/service?product=${product.slug}`}>
            <Headset className="size-4" />
            {mine ? "Edit yours" : "Rate the service"}
          </Link>
        </Button>
      </div>

      {s.count === 0 ? (
        <div className="flex gap-2.5 rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
          <Headset className="mt-0.5 size-4 shrink-0" />
          <p>
            No after-sales experiences yet.{" "}
            <Link
              href={`/contribute/service?product=${product.slug}`}
              className="text-primary hover:underline"
            >
              Dealt with their service? Rate it.
            </Link>
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-2xl font-semibold">
                  <Star className="size-5 fill-amber-400 text-amber-400" />
                  {s.avgRating.toFixed(1)}
                </span>
                <p className="text-xs text-muted-foreground">service rating</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{s.recommendedRate}%</p>
                <p className="text-xs text-muted-foreground">rated it 4★ or better</p>
              </div>
              {s.avgTechnicianRating != null && (
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {s.avgTechnicianRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">avg technician</p>
                </div>
              )}
              {s.medianCost != null && (
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {s.medianCost === 0 ? "Free" : `৳${s.medianCost.toLocaleString()}`}
                  </p>
                  <p className="text-xs text-muted-foreground">typical cost</p>
                </div>
              )}
              {s.medianDurationDays != null && (
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{s.medianDurationDays}d</p>
                  <p className="text-xs text-muted-foreground">typical turnaround</p>
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Dist title="Response time" data={s.responseTime} labels={RESPONSE_TIME} />
              <Dist title="Outcome" data={s.repairOutcome} labels={REPAIR_OUTCOME} />
              <Dist title="Warranty" data={s.warranty} labels={SERVICE_WARRANTY} />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {list.data.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
