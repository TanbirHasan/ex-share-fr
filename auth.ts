import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET ?? "";

type BackendUser = {
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
};

async function backendPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      id: "magic-link",
      name: "Email link",
      credentials: { email: {}, token: {} },
      authorize: async (creds) => {
        const email = typeof creds?.email === "string" ? creds.email : "";
        const token = typeof creds?.token === "string" ? creds.token : "";
        if (!email || !token) return null;

        const u = await backendPost<BackendUser>("/internal/auth/magic-link/consume", {
          email,
          token,
        });
        if (!u) return null;

        return {
          id: u.userId,
          email: u.email,
          name: u.name,
          image: u.avatarUrl,
          role: u.role,
        };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      // OAuth providers: mirror the account into our backend and pull the real id + role.
      if (account?.provider === "google") {
        const synced = await backendPost<BackendUser>("/internal/auth/sync", {
          email: user.email,
          name: user.name ?? undefined,
          avatarUrl: user.image ?? undefined,
          provider: "google",
        });
        if (!synced) return false;
        user.id = synced.userId;
        user.role = synced.role;
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id ?? token.sub;
        token.role = (user.role as string | undefined) ?? "user";
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = (token.sub as string | undefined) ?? "";
        session.user.role = (token.role as string | undefined) ?? "user";
      }
      return session;
    },
  },
});
