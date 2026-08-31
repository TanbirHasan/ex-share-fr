import { getTranslations } from "next-intl/server";
import { HelpCircle } from "lucide-react";
import { auth } from "@/auth";
import { AskQuestionBox } from "@/components/site/ask-question-box";
import { QuestionCard } from "@/components/site/question-card";
import { apiFetch } from "@/lib/backend";
import type { Product } from "@/lib/catalog-types";
import type { Question } from "@/lib/qa-types";

export async function ProductQA({ product }: { product: Product }) {
  const [session, t] = await Promise.all([auth(), getTranslations("qa")]);
  const signedIn = Boolean(session?.user);

  const res = await apiFetch(`/api/v1/products/${product.id}/questions?limit=10`);
  const list: { data: Question[]; total: number } = res.ok
    ? await res.json()
    : { data: [], total: 0 };

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <HelpCircle className="size-5 text-primary" />
        <h2 className="text-lg font-semibold tracking-tight">
          {list.total > 0 ? t("headingCount", { count: list.total }) : t("heading")}
        </h2>
      </div>

      <AskQuestionBox productId={product.id} slug={product.slug} signedIn={signedIn} />

      {list.data.length > 0 ? (
        <div className="mt-4 space-y-3">
          {list.data.map((q) => (
            <QuestionCard key={q.id} question={q} slug={product.slug} signedIn={signedIn} />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex gap-2.5 rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
          <HelpCircle className="mt-0.5 size-4 shrink-0" />
          <p>{t("noQuestionsYet")}</p>
        </div>
      )}
    </section>
  );
}
