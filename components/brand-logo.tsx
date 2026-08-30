import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  href = "/",
  showTagline = false,
}: {
  className?: string;
  href?: string;
  showTagline?: boolean;
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <MessagesSquare className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          Experience<span className="text-primary">Hub</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-[11px] font-medium text-muted-foreground">
            Experience Shared. Decisions Improved.
          </span>
        )}
      </span>
    </Link>
  );
}
