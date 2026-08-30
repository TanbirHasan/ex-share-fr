"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Star,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

function initials(name?: string | null, email?: string | null) {
  const base = name?.trim() || email?.split("@")[0] || "U";
  return base
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="size-9 rounded-full" />;
  }

  if (!session?.user) {
    return (
      <Button asChild size="sm" className="h-9">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const { name, email, image, role } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none ring-ring/50 focus-visible:ring-2">
          <Avatar className="size-9 border">
            <AvatarImage src={image ?? undefined} alt={name ?? "You"} />
            <AvatarFallback className="text-xs">{initials(name, email)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate text-sm font-medium">{name ?? "Your account"}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="size-4" /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/reviews">
            <Star className="size-4" /> My reviews
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/problems">
            <MessageSquareText className="size-4" /> My problems
          </Link>
        </DropdownMenuItem>
        {role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/catalog">
              <UserRound className="size-4" /> Admin catalog
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
