export type ActivityType = "review" | "problem" | "solution";

export type ActivityItem = {
  type: ActivityType;
  id: string;
  createdAt: string;
  actor: { id: string; name: string | null; avatarUrl: string | null } | null;
  product: { slug: string; name: string };
  headline: string;
  snippet: string;
  href: string;
};
