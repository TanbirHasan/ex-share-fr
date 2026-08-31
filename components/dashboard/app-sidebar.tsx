"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Boxes,
  Headset,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareText,
  ShieldCheck,
  Star,
  Tags,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

type Item = { title: string; href: string; icon: typeof Star };

const overview: Item[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
];

const contributions: Item[] = [
  { title: "My reviews", href: "/dashboard/reviews", icon: Star },
  { title: "My problems", href: "/dashboard/problems", icon: MessageSquareText },
  { title: "My solutions", href: "/dashboard/solutions", icon: LifeBuoy },
  { title: "Service reports", href: "/dashboard/service", icon: Headset },
  { title: "Saved products", href: "/dashboard/saved", icon: Bookmark },
];

const admin: Item[] = [
  { title: "Catalog", href: "/dashboard/catalog", icon: Boxes },
  { title: "Categories & brands", href: "/dashboard/taxonomy", icon: Tags },
  { title: "Moderation", href: "/dashboard/moderation", icon: ShieldCheck },
];

export function AppSidebar({
  user,
}: {
  user: { name: string | null; email: string; image: string | null; role: string };
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-1 py-1.5 group-data-[collapsible=icon]:hidden">
          <BrandLogo />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {overview.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Contributions</SidebarGroupLabel>
          <SidebarMenu>
            {contributions.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {user.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
              {admin.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
