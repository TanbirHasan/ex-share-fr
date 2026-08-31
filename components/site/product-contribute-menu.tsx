"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown, Headset, PenLine, Plus, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Single "Share your experience" entry point for the product page. */
export function ProductContributeMenu({
  slug,
  variant = "default",
  className,
}: {
  slug: string;
  variant?: "default" | "outline";
  className?: string;
}) {
  const t = useTranslations("product");

  const items = [
    { href: `/contribute?product=${slug}`, icon: PenLine, label: t("menuWriteReview") },
    {
      href: `/contribute/problem?product=${slug}`,
      icon: TriangleAlert,
      label: t("menuReportProblem"),
    },
    { href: `/contribute/service?product=${slug}`, icon: Headset, label: t("menuRateService") },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={className}>
          <Plus className="size-4" />
          {t("shareExperience")}
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {items.map(({ href, icon: Icon, label }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href}>
              <Icon className="size-4 text-muted-foreground" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
