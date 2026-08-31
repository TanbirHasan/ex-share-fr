export const PROBLEM_CATEGORIES = [
  { value: "cooling", label: "Cooling" },
  { value: "noise", label: "Noise" },
  { value: "display", label: "Display" },
  { value: "power", label: "Power" },
  { value: "software", label: "Software" },
  { value: "build_quality", label: "Build quality" },
  { value: "connectivity", label: "Connectivity" },
  { value: "battery", label: "Battery" },
  { value: "performance", label: "Performance" },
  { value: "after_sales", label: "After-sales" },
  { value: "other", label: "Other" },
] as const;

export type ProblemCategory = (typeof PROBLEM_CATEGORIES)[number]["value"];

export function problemCategoryLabel(v: string): string {
  return PROBLEM_CATEGORIES.find((c) => c.value === v)?.label ?? v;
}

export const PROBLEM_STARTED = [
  { value: "out_of_box", label: "Out of the box" },
  { value: "lt_3m", label: "Within 3 months" },
  { value: "m3_6", label: "3–6 months" },
  { value: "m6_12", label: "6–12 months" },
  { value: "y1_2", label: "1–2 years" },
  { value: "y2_3", label: "2–3 years" },
  { value: "gt_3y", label: "After 3 years" },
] as const;

export function problemStartedLabel(v: string): string {
  return PROBLEM_STARTED.find((s) => s.value === v)?.label ?? v;
}

export const WARRANTY_COVERED = [
  { value: "yes", label: "Fully covered" },
  { value: "partial", label: "Partly covered" },
  { value: "no", label: "Not covered" },
] as const;

export function warrantyLabel(v: string): string {
  return WARRANTY_COVERED.find((w) => w.value === v)?.label ?? v;
}

export type ProductRef = {
  id: string;
  slug: string;
  name: string;
  primaryImage: string | null;
};

export type Person = { id: string; name: string | null; avatarUrl: string | null };

export type Solution = {
  id: string;
  problemId: string;
  body: string;
  contentLang: "bn" | "en";
  workedCount: number;
  didntWorkCount: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  author: Person & { reputation: number };
  viewerConfirmed: "worked" | "didnt" | "none";
  viewerHasVoted: boolean;
  viewerCanEdit: boolean;
};

export type ProblemListItem = {
  id: string;
  slug: string;
  category: ProblemCategory;
  title: string;
  description: string;
  reportCount: number;
  solutionCount: number;
  createdAt: string;
  product: ProductRef;
};

export type ProblemDetail = {
  id: string;
  slug: string;
  category: ProblemCategory;
  title: string;
  description: string;
  reportCount: number;
  createdAt: string;
  product: ProductRef;
  reporter: Person | null;
  viewerHasReported: boolean;
  whenStarted: Record<string, number>;
  warrantyBreakdown: Record<string, number>;
  repairCost: { min: number; max: number; median: number; count: number } | null;
  solutions: Solution[];
};

export type MyProblem = ProblemListItem & { viewerIsCreator: boolean };

export type MySolution = Solution & {
  problem: { id: string; slug: string; title: string };
  product: ProductRef;
};
