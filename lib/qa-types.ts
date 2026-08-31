export type QAPerson = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  reputation: number;
};

export type Answer = {
  id: string;
  questionId: string;
  body: string;
  contentLang: "bn" | "en";
  createdAt: string;
  author: QAPerson;
  isAccepted: boolean;
  viewerCanEdit: boolean;
};

export type Question = {
  id: string;
  productId: string;
  body: string;
  contentLang: "bn" | "en";
  createdAt: string;
  answerCount: number;
  author: QAPerson;
  viewerCanEdit: boolean;
  viewerIsAsker: boolean;
  answers: Answer[];
};

export type MyQuestion = Question & {
  product: { id: string; slug: string; name: string; primaryImage: string | null };
};
