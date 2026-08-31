"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const titleCase = (seg: string) =>
  seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("dashboard.crumbs");
  const label = (seg: string) => t.has(seg) ? t(seg) : titleCase(seg);
  const segments = pathname.split("/").filter(Boolean); // ["dashboard", ...]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const last = i === segments.length - 1;
          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage>{label(seg)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label(seg)}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!last && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
