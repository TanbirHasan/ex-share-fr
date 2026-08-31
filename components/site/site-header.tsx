"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bell, GitCompareArrows, Menu, PenLine } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SearchCommand } from "@/components/site/search-command";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/site/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { key: "products", href: "/products" },
  { key: "brands", href: "/brands" },
  { key: "problems", href: "/problems" },
  { key: "compare", href: "/compare" },
  { key: "helpMeChoose", href: "/help-me-choose" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const th = useTranslations("header");

  const items = [{ key: "home" as const, href: "/" }, ...nav];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b">
              <SheetTitle className="text-left">
                <BrandLogo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                    pathname === item.href && "bg-muted text-foreground",
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
            <div className="p-3">
              <Button asChild className="w-full">
                <Link href="/contribute">
                  <PenLine className="size-4" /> {th("shareExperience")}
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <BrandLogo className="shrink-0" />

        <SearchCommand className="mx-2 hidden max-w-xl flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            aria-label={th("notifications")}
          >
            <Bell className="size-4" />
          </Button>

          <Button asChild className="mx-1 hidden lg:flex">
            <Link href="/contribute">
              <PenLine className="size-4" /> {th("shareExperience")}
            </Link>
          </Button>

          <UserMenu />
        </div>
      </div>

      {/* Secondary nav */}
      <div className="hidden border-t lg:block">
        <nav className="mx-auto flex h-11 max-w-7xl items-center gap-1 px-6 text-sm">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              }
            >
              {item.key === "compare" ? (
                <span className="flex items-center gap-1.5">
                  <GitCompareArrows className="size-3.5" />
                  {t(item.key)}
                </span>
              ) : (
                t(item.key)
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile search */}
      <div className="border-t p-3 md:hidden">
        <SearchCommand />
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground",
        active && "text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
