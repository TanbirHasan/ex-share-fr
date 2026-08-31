"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Check, Languages } from "lucide-react";
import { setLocale } from "@/app/set-locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_LABELS, locales } from "@/i18n/config";

export function LanguageSwitcher() {
  const current = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden gap-1.5 sm:flex"
          disabled={pending}
          aria-label={t("changeLanguage")}
        >
          <Languages className="size-4" />
          {current === "bn" ? "বাংলা" : "EN"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() =>
              start(async () => {
                await setLocale(l);
                router.refresh();
              })
            }
          >
            <Check className={l === current ? "size-4 opacity-100" : "size-4 opacity-0"} />
            {LOCALE_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
