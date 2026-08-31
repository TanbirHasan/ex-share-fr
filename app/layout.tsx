import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import { auth } from "@/auth";
import { THEME_STORAGE_KEY } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ExperienceHub — Real product experiences from Bangladesh",
    template: "%s · ExperienceHub",
  },
  description:
    "Honest reviews, common problems, and fixes that actually worked — from real owners in Bangladesh.",
};

// Runs before hydration so the correct theme class is on <html> with no flash.
const themeInit = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})||"system";var d=s==="dark"||(s==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(_){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background">
        <Script id="eh-theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        <Providers session={session}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
