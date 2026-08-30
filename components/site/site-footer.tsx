import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const columns = [
  {
    heading: "Explore",
    links: [
      ["Products", "/products"],
      ["Brands", "/brands"],
      ["Reviews", "/reviews"],
      ["Problems", "/problems"],
      ["Solutions", "/solutions"],
    ],
  },
  {
    heading: "Contribute",
    links: [
      ["Share an experience", "/contribute"],
      ["Report a problem", "/contribute/problem"],
      ["Add a solution", "/contribute/solution"],
      ["Request a product", "/contribute/request"],
    ],
  },
  {
    heading: "About",
    links: [
      ["How it works", "/about"],
      ["Content policy", "/policy"],
      ["Terms", "/terms"],
      ["Privacy", "/privacy"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <BrandLogo showTagline />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A community knowledge base of real product ownership experiences in
            Bangladesh.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              {col.heading}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ExperienceHub. Built in Bangladesh.</p>
          <p>Experience Shared. Decisions Improved.</p>
        </div>
      </div>
    </footer>
  );
}
