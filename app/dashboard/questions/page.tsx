import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ImageOff, MessagesSquare } from "lucide-react";
import { DeleteQuestionButton } from "@/components/dashboard/delete-question-button";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";
import { formatDate } from "@/lib/format";
import type { MyQuestion } from "@/lib/qa-types";

export const dynamic = "force-dynamic";

export default async function MyQuestionsPage() {
  const [t, data] = await Promise.all([
    getTranslations("dashboard.pages"),
    apiGet<Paginated<MyQuestion>>("/api/v1/me/questions?limit=50"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("questionsTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("questionsCount", { count: data.total })}
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">{t("questionsEmpty")}</p>
          <Button asChild className="mt-4">
            <Link href="/products">{t("browseProducts")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.data.map((q) => {
            const accepted = q.answers.some((a) => a.isAccepted);
            return (
              <li key={q.id} className="flex gap-4 rounded-xl border bg-card p-4">
                <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {q.product.primaryImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={q.product.primaryImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageOff className="size-5 text-muted-foreground" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{q.body}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Link href={`/products/${q.product.slug}`} className="hover:underline">
                      {q.product.name}
                    </Link>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <MessagesSquare className="size-3.5" />
                      {t("answerCount", { count: q.answerCount })}
                    </span>
                    {accepted && (
                      <span className="text-emerald-700 dark:text-emerald-400">
                        · {t("answered")}
                      </span>
                    )}
                    <span>· {formatDate(q.createdAt)}</span>
                  </p>
                </div>
                <div className="shrink-0">
                  <DeleteQuestionButton id={q.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
