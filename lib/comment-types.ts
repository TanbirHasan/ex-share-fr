export type Comment = {
  id: string;
  targetType: "review" | "solution";
  targetId: string;
  body: string;
  contentLang: "bn" | "en";
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    reputation: number;
  };
  viewerCanEdit: boolean;
};
