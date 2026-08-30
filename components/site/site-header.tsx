"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  GitCompareArrows,
  Languages,
  Menu,
  PenLine,
  Search,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/site/user-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "Reviews", href: "/reviews" },
  { label: "Problems", href: "/problems" },
  { label: "Solutions", href: "/solutions" },
  { label: "Compare", href: "/compare" },
];

function SearchBar({ className }: { className?: string }) {
  return (
    <form action="/search" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="q"
        placeholder="Search product, model, brand or problem…"
        className="h-10 pl-9"
        aria-label="Search"
      />
    </form>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

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
              {[{ label: "Home", href: "/" }, ...nav].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                    pathname === item.href && "bg-muted text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-3">
              <Button asChild className="w-full">
                <Link href="/contribute">
                  <PenLine className="size-4" /> Share Experience
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <BrandLogo className="shrink-0" />

        <SearchBar className="mx-2 hidden max-w-xl flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:flex">
                <Languages className="size-4" />
                EN
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>বাংলা</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>

          <Button asChild className="mx-1 hidden lg:flex">
            <Link href="/contribute">
              <PenLine className="size-4" /> Share Experience
            </Link>
          </Button>

          <UserMenu />
        </div>
      </div>

      {/* Secondary nav */}
      <div className="hidden border-t lg:block">
        <nav className="mx-auto flex h-11 max-w-7xl items-center gap-1 px-6 text-sm">
          <NavLink href="/" active={pathname === "/"}>
            Home
          </NavLink>
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} active={pathname.startsWith(item.href)}>
              {item.label === "Compare" ? (
                <span className="flex items-center gap-1.5">
                  <GitCompareArrows className="size-3.5" />
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile search */}
      <div className="border-t p-3 md:hidden">
        <SearchBar />
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
