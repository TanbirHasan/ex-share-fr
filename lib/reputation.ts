import {
  Award,
  LifeBuoy,
  Star,
  ThumbsUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const REP_LEVELS = [
  { min: 150, key: "expert", label: "Community expert" },
  { min: 50, key: "top", label: "Top contributor" },
  { min: 15, key: "trusted", label: "Trusted contributor" },
  { min: 1, key: "contributor", label: "Contributor" },
  { min: 0, key: "new", label: "New here" },
] as const;

export function reputationLevel(score: number) {
  return REP_LEVELS.find((l) => score >= l.min)!;
}

export const BADGE_ICON: Record<string, LucideIcon> = {
  reviewer: Star,
  prolific_reviewer: Star,
  problem_solver: LifeBuoy,
  trusted_fixer: Wrench,
  helpful: ThumbsUp,
  long_term_owner: Award,
};

export type Profile = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  staff: boolean;
  counts: {
    reviews: number;
    problems: number;
    solutions: number;
    helpfulReceived: number;
  };
  score: number;
  level: { key: string; label: string };
  badges: { key: string; label: string; description: string }[];
  recent: {
    reviews: {
      id: string;
      rating: number;
      comment: string | null;
      createdAt: string;
      product: { slug: string; name: string };
    }[];
    problems: {
      id: string;
      slug: string;
      title: string;
      reportCount: number;
      createdAt: string;
      productName: string;
    }[];
    solutions: {
      id: string;
      body: string;
      workedCount: number;
      helpfulCount: number;
      createdAt: string;
      problem: { slug: string; title: string };
    }[];
  };
};
