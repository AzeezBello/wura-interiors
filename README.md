# Wura Interiors

Premium interior design and furniture website with a secure admin dashboard.

- **Public site:** Home, About, Services, Portfolio (category filter + project pages), Contact. WhatsApp is the primary enquiry channel.
- **Admin dashboard (`/admin`):** projects and image galleries, categories, services, site settings (WhatsApp number, contact details, logo, About content), draft/publish workflow, project preview, launch-readiness checklist.
- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Storage, RLS) · Vercel.

No company facts are hard-coded. Everything shown on the public site (name, tagline, numbers, About text, services, projects, logo) comes from the admin dashboard, and every section has a clean empty state until content is added.

## 1. Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Without Supabase variables the public pages still render (empty states) and `/admin/login` shows a configuration warning.

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page (the `anon` / publishable key) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://wurainteriors.com` (used for sitemap and social previews) |

The service-role key is **not used** anywhere and must never be added to this project.

## 2. Set up Supabase

1. Create a Supabase project.
2. Open **SQL Editor**, paste the contents of `supabase/migrations/0001_init.sql` and run it. This creates the tables, triggers, Row Level Security policies, and the `project-images` and `brand-assets` storage buckets with admin-only write policies.
3. **Authentication → Providers → Email:** turn **off** "Allow new users to sign up". Admins are created manually, so nobody can register themselves.
4. **Authentication → Users → Add user:** create the admin account (email + password).
5. Open `supabase/make_admin.example.sql`, replace the email with the admin's email, and run it. Only users listed in the `profiles` table are treated as admins (enforced in middleware, server actions and RLS).
6. **Authentication → URL Configuration:** set the Site URL to the production domain.

## 3. Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel choose **Add New → Project**, import the repo (framework is auto-detected).
3. Add the three environment variables above, then deploy.
4. Add the custom domain, then update `NEXT_PUBLIC_SITE_URL` and the Supabase Site URL.

## 4. Go live checklist

The admin overview shows a live **launch readiness** checklist. In short, the client needs to supply:

- Official logo (Settings → Logo). A text placeholder is used until then.
- WhatsApp number in international format, e.g. `+234…` (Settings). Until set, enquiry buttons fall back to the Contact page.
- Business name, contact details, social links, About story and founder details, only what the client has confirmed.
- At least one category, the confirmed services, and published projects. A project can only be published once it has at least one image.

## Security notes

- Defence in depth: middleware redirect → `requireAdmin()` in the dashboard layout → admin check inside every server action → Postgres RLS. No privileged key is used.
- Public pages use a cookieless anon client and only ever read published content (enforced by RLS, not just by queries).
- Uploads are validated in the browser (type and size) and by bucket limits on the server (10 MB project images, 2 MB brand assets).
- **Trade-off:** storage buckets are public-read so images load fast through the CDN. Images of draft projects therefore live at unguessable random URLs rather than behind access control. Do not upload anything to a draft that must stay confidential.
- Login brute-force protection relies on Supabase Auth's built-in rate limits; no extra limiter is included.

## Known limitations

- No full-screen lightbox in project galleries.
- No before/after image pairs.
- Upload progress is per file, not per byte.
- Image reordering uses up/down buttons rather than drag and drop.
- Not yet exercised against a live Supabase project in this build environment; do a test pass (login, create category, create project, upload, publish) right after setup.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
# wura-interiors
