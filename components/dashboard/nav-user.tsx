"use client";

import { signOut } from "next-auth/react";
import { ChevronsUpDown, LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: { name: string | null; email: string; image: string | null };
}) {
  const { isMobile } = useSidebar();
  const initials =
    (user.name?.trim() || user.email)
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "You"} />
                <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name ?? "Your account"}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
          >
            <DropdownMenuLabel className="flex flex-col">
              <span className="truncate text-sm font-medium">{user.name ?? "Your account"}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
