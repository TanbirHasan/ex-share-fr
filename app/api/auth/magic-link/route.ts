import { NextResponse } from "next/server";
import { sendMagicLink } from "@/lib/email";
import { safeCallbackUrl } from "@/lib/safe-redirect";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function POST(req: Request) {
  let email = "";
  let callbackUrl = "/dashboard";
  try {
    const body = (await req.json()) as { email?: unknown; callbackUrl?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    callbackUrl = safeCallbackUrl(
      typeof body.callbackUrl === "string" ? body.callbackUrl : null,
    );
  } catch {
    // ignore — handled below
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const res = await fetch(`${BACKEND_URL}/internal/auth/magic-link/request`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  if (res.status === 429) {
    return NextResponse.json(
      { error: "Too many sign-in links requested. Try again in a few minutes." },
      { status: 429 },
    );
  }
  if (!res.ok) {
    return NextResponse.json({ error: "Could not send the sign-in link." }, { status: 502 });
  }

  const { token, expiresAt } = (await res.json()) as { token: string; expiresAt: string };
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  let link = `${appUrl}/auth/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  if (callbackUrl !== "/dashboard") {
    link += `&callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }

  await sendMagicLink(email, link, expiresAt);

  return NextResponse.json({ ok: true });
}
