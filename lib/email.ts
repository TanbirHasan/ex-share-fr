import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM ?? "ExperienceHub <onboarding@resend.dev>";
const resend = apiKey ? new Resend(apiKey) : null;

function logLink(email: string, url: string, note: string) {
  // Always available in the server console as a fallback for local dev / failures.
  console.log(`\n✉️  Magic sign-in link for ${email} (${note})\n   ${url}\n`);
}

function magicLinkHtml(url: string, expiresAt: string): string {
  const expires = new Date(expiresAt).toUTCString();
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f8f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#17231f">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#ffffff;border:1px solid #dce4e0;border-radius:14px;padding:32px">
          <tr><td>
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0f766e">ExperienceHub</p>
            <h1 style="margin:8px 0 0;font-size:20px;font-weight:600">Sign in to ExperienceHub</h1>
            <p style="margin:12px 0 24px;font-size:14px;line-height:1.6;color:#47574f">
              Click the button below to finish signing in. This link works once and expires ${expires}.
            </p>
            <a href="${url}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:10px">
              Sign in
            </a>
            <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#7a8b83;word-break:break-all">
              Or paste this link into your browser:<br />${url}
            </p>
            <p style="margin:20px 0 0;font-size:12px;color:#7a8b83">
              If you didn't request this, you can safely ignore this email.
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function sendMagicLink(
  email: string,
  url: string,
  expiresAt: string,
): Promise<{ sent: boolean }> {
  if (!resend) {
    logLink(email, url, "no RESEND_API_KEY set");
    return { sent: false };
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: "Your ExperienceHub sign-in link",
      html: magicLinkHtml(url, expiresAt),
      text: `Sign in to ExperienceHub:\n${url}\n\nThis link works once and expires ${new Date(
        expiresAt,
      ).toUTCString()}. If you didn't request it, ignore this email.`,
    });

    if (error) {
      console.error("Resend send failed:", error);
      logLink(email, url, "email failed — use this link");
      return { sent: false };
    }
    return { sent: true };
  } catch (e) {
    console.error("Resend threw:", e);
    logLink(email, url, "email failed — use this link");
    return { sent: false };
  }
}
