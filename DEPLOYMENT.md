# Where this is hosted

| Layer | Provider | Plan | Notes |
|---|---|---|---|
| Frontend (this repo) | [Vercel](https://vercel.com) | Free (Hobby) | Deploys from `main` on push. |
| API | [Render](https://render.com) | Free Web Service | Repo: `ex-share-bk`. See that repo's `DEPLOYMENT.md`. |
| Database | [Neon](https://neon.tech) | Free tier Postgres | Used by the backend only — this repo never talks to Postgres directly. |
| Image uploads | [Cloudinary](https://cloudinary.com) | Free tier | Used by the backend only. |
| Transactional email | [Resend](https://resend.com) | Free tier | Currently only used for... nothing live — see "Magic-link is OFF" below. |

Live URL: `https://ex-share-fr.vercel.app`

## Vercel project settings
- Framework preset: Next.js (auto-detected)
- Root directory: `.` (repo root)
- No custom build/install command overrides needed

## Environment variables (set in Vercel → Project → Settings → Environment Variables)
| Key | Where it comes from |
|---|---|
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google Cloud Console → APIs & Services → Credentials → the OAuth 2.0 Client ID. Redirect URI `https://ex-share-fr.vercel.app/api/auth/callback/google` must be added there too. |
| `BACKEND_URL` | The live Render URL, e.g. `https://ex-share-bk.onrender.com` |
| `APP_URL` | `https://ex-share-fr.vercel.app` |
| `AUTH_SHARED_SECRET` | **Must exactly match** the backend's `AUTH_SHARED_SECRET` on Render |
| `INTERNAL_API_SECRET` | **Must exactly match** the backend's `INTERNAL_API_SECRET` on Render |
| `RESEND_API_KEY` / `RESEND_FROM` | Resend dashboard — only matters once magic-link is re-enabled (see below) |

## Magic-link sign-in is OFF
Resend's free sandbox sender (`onboarding@resend.dev`) only delivers to the account owner's own email, so it can't reach real users. Disabled via a `MAGIC_LINK_ENABLED = false` flag (not deleted) in:
- `app/login/page.tsx` (email-link form hidden, Google button stays)
- `app/api/auth/magic-link/route.ts` (returns 503 instead of calling Resend)
- matching flag on the backend in `src/modules/internal/internal.routes.ts`

Google sign-in is the only live auth path right now. **To re-enable:** buy a domain, verify it in Resend, update `RESEND_FROM` to an address on that domain, flip all three `MAGIC_LINK_ENABLED` flags back to `true`, redeploy both apps.

## Redeploying
Push to `main` — Vercel auto-deploys. Changing an env var requires a redeploy to take effect (Vercel will prompt or you can trigger one manually from the dashboard).
