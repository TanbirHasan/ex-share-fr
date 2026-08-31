"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Bookmark,
  Boxes,
  Headset,
  HelpCircle,
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

type Item = { key: string; href: string; icon: typeof Star };

const overview: Item[] = [
  { key: "overview", href: "/dashboard", icon: LayoutDashboard },
];

const contributions: Item[] = [
  { key: "myReviews", href: "/dashboard/reviews", icon: Star },
  { key: "myProblems", href: "/dashboard/problems", icon: MessageSquareText },
  { key: "mySolutions", href: "/dashboard/solutions", icon: LifeBuoy },
  { key: "myQuestions", href: "/dashboard/questions", icon: HelpCircle },
  { key: "serviceReports", href: "/dashboard/service", icon: Headset },
  { key: "savedProducts", href: "/dashboard/saved", icon: Bookmark },
];

const admin: Item[] = [
  { key: "catalog", href: "/dashboard/catalog", icon: Boxes },
  { key: "categoriesBrands", href: "/dashboard/taxonomy", icon: Tags },
  { key: "moderation", href: "/dashboard/moderation", icon: ShieldCheck },
];

export function AppSidebar({
  user,
}: {
  user: { name: string | null; email: string; image: string | null; role: string };
}) {
  const pathname = usePathname();
  const t = useTranslations("dashboard.nav");
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
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={t(item.key)}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{t(item.key)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("contributions")}</SidebarGroupLabel>
          <SidebarMenu>
            {contributions.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={t(item.key)}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{t(item.key)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {user.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("admin")}</SidebarGroupLabel>
            <SidebarMenu>
              {admin.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={t(item.key)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{t(item.key)}</span>
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
