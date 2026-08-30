import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { HeaderBreadcrumb } from "@/components/dashboard/header-breadcrumb";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = {
    name: session.user.name ?? null,
    email: session.user.email ?? "",
    image: session.user.image ?? null,
    role: session.user.role ?? "user",
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <HeaderBreadcrumb />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
