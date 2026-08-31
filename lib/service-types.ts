export const RESPONSE_TIME = [
  { value: "same_day", label: "Same day" },
  { value: "within_3_days", label: "Within 3 days" },
  { value: "within_a_week", label: "Within a week" },
  { value: "over_a_week", label: "Over a week" },
  { value: "no_response", label: "No response" },
] as const;

export const CHANNEL = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "service_center", label: "Service centre" },
  { value: "home_visit", label: "Home visit" },
  { value: "social_media", label: "Social media" },
  { value: "other", label: "Other" },
] as const;

export const REPAIR_OUTCOME = [
  { value: "fixed", label: "Fixed" },
  { value: "partly_fixed", label: "Partly fixed" },
  { value: "not_fixed", label: "Not fixed" },
  { value: "replaced", label: "Unit replaced" },
  { value: "refunded", label: "Refunded" },
  { value: "pending", label: "Still pending" },
] as const;

export const SERVICE_WARRANTY = [
  { value: "yes", label: "Covered" },
  { value: "partial", label: "Partly covered" },
  { value: "no", label: "Not covered" },
  { value: "unsure", label: "Not sure" },
] as const;

type Opt = { value: string; label: string };

export function labelFor(list: readonly Opt[], value: string): string {
  return list.find((o) => o.value === value)?.label ?? value;
}

export type ServiceExperience = {
  id: string;
  productId: string;
  rating: number;
  responseTime: string;
  channel: string;
  repairOutcome: string;
  warranty: string;
  technicianRating: number | null;
  issue: string | null;
  cost: number | null;
  durationDays: number | null;
  comment: string | null;
  contentLang: "bn" | "en";
  status: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string | null; avatarUrl: string | null };
  viewerCanEdit: boolean;
};

export type ServiceSummary = {
  count: number;
  avgRating: number;
  avgTechnicianRating: number | null;
  recommendedRate: number;
  responseTime: Record<string, number>;
  repairOutcome: Record<string, number>;
  warranty: Record<string, number>;
  medianCost: number | null;
  medianDurationDays: number | null;
};

export type ServiceList = {
  data: ServiceExperience[];
  total: number;
  limit: number;
  offset: number;
  summary: ServiceSummary;
};

export type MyServiceExperience = ServiceExperience & {
  product: { id: string; slug: string; name: string; primaryImage: string | null };
};
