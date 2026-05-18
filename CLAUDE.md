@AGENTS.md
@AI_HARNESS.md

# ADEO Solution Corporate Website — AI Project Memory

> **All AI agents must also read [`AI_HARNESS.md`](AI_HARNESS.md)** — it defines
> the mandatory 6-step pipeline and architecture guardrails that govern every
> change to this codebase.

This file is the canonical context handoff between AI sessions. Read it before
any non-trivial work. When you change something material here, update it in
the same commit.

---

## 1. Project Overview

A full-stack B2B corporate website for **ADEO Solution** — an enterprise IT &
Cloud Services provider. The site has two halves:

- **Public marketing pages** (Home, IT Solutions, Cloud Services, Contact) —
  prerendered with ISR, dynamic content sourced from Prisma.
- **Admin CMS** (`/admin/*`) — authenticated dashboard with CRUD for Services,
  Partners, and a Contact-submission Inbox. Local file uploads to
  `public/uploads/`.

### Tech Stack

| Layer        | Choice                                        | Why pinned                                             |
|--------------|-----------------------------------------------|--------------------------------------------------------|
| Framework    | **Next.js 15.5.x** (App Router, React 19)     | Next 16 + Prisma 7 require Node ≥ 20.19 — we run 20.14 |
| ORM          | **Prisma 5.22.x** + PostgreSQL (Docker)       | Same Node-version constraint                           |
| Auth         | **NextAuth v5 (`5.0.0-beta.25`)**             | Edge-compatible, Credentials provider                  |
| Styling      | **Tailwind CSS v4** (`@theme inline` syntax)  | New tokenized theme model                              |
| Validation   | **Zod 3.24**                                  | Schemas live under `src/lib/validations/`              |
| Rate limit   | **`rate-limiter-flexible`** (in-memory)       | Swap to Redis adapter in production                    |
| Hashing      | **bcryptjs** (cost 12)                        | Used by Credentials provider                           |
| Env          | **`@t3-oss/env-nextjs`**                      | Type-safe env validation at startup                    |
| Runtime      | **Node.js 20.14.0**                           | Hard pin — see "Why pinned" above                      |

---

## 2. Architecture Notes

### Route groups
```
src/app/
├── (public)/
│   ├── (marketing)/    ← Header + Footer layout, public pages
│   │   ├── page.tsx              → /
│   │   ├── solutions/page.tsx    → /solutions
│   │   ├── cloud/page.tsx        → /cloud
│   │   └── contact/              → /contact
│   └── login/                    → /login    (no marketing chrome)
├── (admin)/
│   └── admin/                    → /admin/*  (full CMS)
└── api/auth/[...nextauth]/       → NextAuth route handler
```
Route groups (`(name)`) are URL-invisible. The `(marketing)` sub-group exists
solely so the login page does *not* inherit the public Header/Footer.

### NextAuth v5: Edge / Node split (CRITICAL)

NextAuth v5 cannot run Prisma + bcrypt on the Edge Runtime. We split the
config into two files:

- **`src/auth.config.ts`** — Edge-safe. No DB, no bcrypt. Contains:
  - `pages`, `session.strategy = "jwt"`
  - `callbacks.authorized` (the route guard used by `middleware.ts`)
  - `callbacks.jwt` / `callbacks.session` (token shape, role propagation)
  - `providers: []` (intentionally empty here)
- **`src/auth.ts`** — Node.js. Imports `auth.config.ts`, adds the
  `Credentials` provider with Prisma + bcrypt + Zod inside `authorize()`.

**`middleware.ts` MUST import only `auth.config.ts`** — never `auth.ts`. If
you ever see Edge-runtime errors mentioning `bcrypt` or `prisma`, this is
why. Server Actions / route handlers import `auth` from `src/auth.ts`.

### ISR for marketing pages
Marketing routes export `export const revalidate = 60`. Mutations in admin
Server Actions call `revalidatePath('/')`, `'/solutions'`, `'/cloud'`,
`/admin/services`, etc. — to flush stale renders.

### Server Actions: `"use server"` files

Next 15 enforces that any module with `"use server"` at the top can **only
export async functions**. We hit this twice:

- Form-state types and the `initialState` constants live in sibling
  `form-state.ts` files (e.g. `src/app/(admin)/admin/services/form-state.ts`),
  not in `actions.ts`.
- For per-row update actions that need a bound `id`, use
  `updateServiceAction.bind(null, id)` in the page component, not an inline
  `"use server"` arrow function (Next will reject the page).

---

## 3. Security Standards (OWASP)

Layered defence — every state change crosses at least three checks.

### A01 — Broken Access Control: 4-layer RBAC

Roles: `ADMIN` (full) | `EDITOR` (no destructive ops).

| Layer | Mechanism | File |
|-------|-----------|------|
| 1. URL gate          | Middleware → `auth.config.ts::authorized`    | `src/middleware.ts`, `src/auth.config.ts` |
| 2. Page render guard | `requireAdminPage()` redirects to `/login`   | `src/lib/auth/require-admin.ts` |
| 3. Action guard      | `requireAdminAction()` throws on missing role | same |
| 4. ADMIN-only ops    | `requireFullAdmin()` rejects EDITOR           | same |

Never delete the page-level or action-level guard "because middleware already
checks." Each layer protects against a different failure mode.

### A03 — Injection
- **All DB access via Prisma** (parameterised). No raw SQL anywhere.
- **All user input through Zod schemas** in `src/lib/validations/` *before*
  Prisma sees it. Schemas: `auth.ts`, `contact.ts`, `service.ts`,
  `partner.ts`, `inbox.ts`.

### A07 — Authentication failures
Two independent in-memory rate limiters in `src/lib/security/rate-limit.ts`:

| Limiter            | Limit               | Reset on success? |
|--------------------|---------------------|-------------------|
| `loginLimiter`     | 5 / 15 min / IP     | Yes               |
| `contactLimiter`   | 3 / hour / IP       | No                |

IP read from `x-forwarded-for` (first hop) → `x-real-ip` → `127.0.0.1`.
Migrate to `RateLimiterRedis` before scaling beyond one instance.

### Contact form anti-spam
- Hidden honeypot field named `website` (`absolute left-[-9999px]`,
  `tabindex={-1}`). Zod requires it to be empty; if tripped, return a generic
  error so bots don't learn the trigger.
- Combined with the per-IP rate limit and Zod bounds.

### Other hardening
- 7 security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch).
- `poweredByHeader: false`.
- File uploads (`src/lib/upload.ts`): MIME allow-list, 5 MB cap, random
  filenames via `crypto.randomBytes`, deletion path-resolved against the
  uploads dir to prevent traversal.
- `secret: process.env.NEXTAUTH_SECRET` validated at boot via `src/env.ts`
  (≥ 32 chars).

---

## 4. Database & Schema Overview

Prisma schema: `prisma/schema.prisma`. PostgreSQL via Docker
(`docker-compose.yml` → `postgres:16-alpine`).

### Core models
| Model                 | Purpose                              | Notable fields                            |
|-----------------------|--------------------------------------|-------------------------------------------|
| `User`                | NextAuth + admin auth                | `password` (bcrypt), `role` (ADMIN/EDITOR)|
| `Account` / `Session` / `VerificationToken` | NextAuth boilerplate     | `@@map` snake_case table names            |
| `Service`             | Marketing service offerings          | `slug` unique, `features` JSON, `category` enum, `icon` relative URL |
| `Partner`             | Technology partners (logos)          | `logoUrl` relative URL, `category` enum   |
| `ContactSubmission`   | Contact form inbox                   | `status` enum (NEW/READ/REPLIED), DESC index on `createdAt` |

### Enums
- `UserRole`: ADMIN, EDITOR
- `ServiceCategory`: SOFTWARE_DEV, IT_SUPPORT, NETWORK, CLOUD_NATIVE,
  MIGRATION, CONNECTIVITY, BACKUP_DR
- `PartnerCategory`: NETWORK, CLOUD, SECURITY, HARDWARE
- `ContactStatus`: NEW, READ, REPLIED

### Local upload strategy
Images for `Service.icon` and `Partner.logoUrl` are saved to
**`public/uploads/`** with random filenames; only the relative URL
(`/uploads/abc123.png`) goes to the database. This was an explicit user
decision over S3/CDN: simpler ops, no third-party dependency. Replaced files
are unlinked after the DB write succeeds.

### Seed data (`prisma/seed.ts`)
Idempotent (`upsert`). Creates an admin user, 7 services, 12 partners
(placeholder logos), and 1 sample contact submission.
Seed admin: **`admin@adeo.co.th`** / **`Admin@ADEO2025!`** — change in
production.

---

## 5. Coding Conventions

### Brand palette (use literally)
- **Navy:** `#0A1628` — dark surfaces, footer, hero, admin sidebar
- **Electric Blue:** `#0066FF` — primary actions, links, focus rings
- **Light Blue:** `#3385FF` — accents on dark backgrounds

Tailwind v4 tokens are defined in `src/app/globals.css` (`--color-blue-brand`,
etc.) but the codebase uses arbitrary-value form (`bg-[#0066ff]`) consistently
for visual grep-ability. Either is fine — just match the file you're editing.

### UI primitives — `src/components/ui/`
`Container`, `Button` + `ButtonLink` + `buttonClasses`, `Card`,
`SectionHeader`. Use these instead of hand-rolling layout in pages.

### Marketing sections — `src/components/sections/`
`Hero`, `PageHero`, `Header`, `Footer`, `Logo`, `StatsBar`, `ServiceGrid`,
`ServiceDetailList`, `PartnerGrid`, `CTASection`.

### Admin primitives — `src/components/admin/`
`AdminSidebar`, `LogoutButton`, `PageHeader` + `PageBody`, `StatCard`,
`StatusBadge` (`Badge`, `ContactStatusBadge`, `ActiveBadge`), `Table` + cells,
`FormField` (`FieldLabel`, `FieldError`, `FormSection`, `inputClass`),
`SubmitButton` (uses `useFormStatus`), `DeleteButton` (confirm + transition),
`FormFeedback`, `EmptyState`.

### Server Action shape (the pattern, every time)

```ts
"use server";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { someSchema } from "@/lib/validations/...";
import { prisma } from "@/lib/db";

export async function doSomethingAction(
  _prevState: SomeFormState,
  formData: FormData,
): Promise<SomeFormState> {
  await requireAdminAction();              // 1. RBAC

  const parsed = someSchema.safeParse({...formData...});  // 2. Zod
  if (!parsed.success) return { status: "error", ... };

  try {                                    // 3. Prisma
    await prisma.x.create({ data: parsed.data });
  } catch (err) { ... }

  revalidatePath("...");                   // 4. Cache flush
  redirect("...");                         // 5. PRG
}
```

Form state types + `initialState` live in `form-state.ts` (sibling file), NOT
in `actions.ts` — see Architecture Notes above.

### Form pattern
Page (server) renders form component (client). Client uses
`useActionState(action, initialState)`. Field-level errors come back via
`state.fieldErrors[name][0]`. `<SubmitButton>` reads `useFormStatus()` for
`pending`.

### File-naming
- Server Actions: `actions.ts`
- Form-state types/initial values: `form-state.ts`
- Page components: `page.tsx`
- Layouts: `layout.tsx`
- Client form components: `XForm.tsx` (PascalCase)

---

## 6. The 6-Step AI Pipeline

> Canonical definition lives in [`AI_HARNESS.md`](AI_HARNESS.md). The table
> below is kept for quick reference but the harness file is authoritative.

Every non-trivial feature follows this cadence. Wait for user approval at each
boundary — never skip ahead.

| Step | Name        | What happens                                                |
|------|-------------|-------------------------------------------------------------|
| 1    | **Ask**     | Clarify scope, constraints, and acceptance criteria         |
| 2    | **Plan**    | Produce an architecture/implementation plan; wait for ✅     |
| 3    | **Implement** | Write the code, narrate decisions, keep diffs cohesive     |
| 4    | **Review Diff** | Hand the diff to the user; wait for feedback or approval |
| 5    | **Run / Test** | `npx tsc --noEmit` + `npm run build` — both must be clean |
| 6    | **Commit**  | Conventional-commit message, push to remote                 |

### Phase history (delivered)
| Phase | Name       | Commit (HEAD on completion)                         |
|-------|------------|-----------------------------------------------------|
| 1     | Init       | `feat(core): phase 1 init with next15, security headers, and base config` |
| 2     | Schema     | `feat(schema): phase 2 prisma schema, migration, and seed data` |
| 3     | Auth       | `feat(auth): phase 3 nextauth credentials provider, rbac, rate limiting, login page` |
| 4     | UI         | `feat(ui): phase 4 public marketing pages, primitives, and secure contact form` |
| 5     | Admin CMS  | `feat(admin): phase 5 cms dashboard, ...`           |

### Build & test loop
```bash
rm -rf .next && npx tsc --noEmit    # Clean type check (clear cache for stale type validators)
npm run build                       # Full production build
npm run dev                         # Local dev
docker compose up -d                # Postgres
npm run db:seed                     # Reseed admin + sample data
```

`tsc --noEmit` is canonical — `npm run lint` is currently set to ignore
during builds (`next.config.ts` → `eslint.ignoreDuringBuilds: true`); ESLint
should be wired into CI separately, not gating local builds.

---

## 7. Things future-you should know

- **Don't change Node version** without re-evaluating Next/Prisma versions.
  `package.json` deps are pinned to a working set for Node 20.14.
- **Don't commit `.env`** (gitignored, but `.env.example` is whitelisted via
  `!.env.example`).
- **Don't touch `seed.ts`'s feature serialization** without also updating
  `parseFeatures()` in `src/lib/services.ts` — that helper handles both the
  current JSON-stringified form and the future array-form the admin CRUD
  emits.
- **Phases 1–5 = MVP.** No phase 6 was scoped. Future work (analytics,
  i18n, S3 uploads, Redis rate limiter, OAuth providers) is greenfield.
