export type NotificationType =
  | "answer_received"
  | "comment_received"
  | "helpful_vote"
  | "solution_worked"
  | "content_approved"
  | "content_rejected"
  | "content_removed"
  | "followed_new_review"
  | "followed_new_problem"
  | "followed_new_solution";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  meta: Record<string, unknown>;
  actor: { name: string | null; avatarUrl: string | null } | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationList = {
  data: NotificationItem[];
  unreadCount: number;
  total: number;
};
