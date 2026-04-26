# ADEO Solution Corporate Website

Enterprise-grade B2B website for **ADEO Solution** — IT Solutions and Cloud
Services. Includes a public marketing site (Home, IT Solutions, Cloud
Services, Contact) and a secure admin CMS for managing services, partners,
and contact submissions.

> **Status:** MVP complete (Phases 1–5).

---

## Tech Stack

- **[Next.js 15.5](https://nextjs.org)** — App Router, React 19, Server Actions
- **[Prisma 5.22](https://www.prisma.io)** — type-safe ORM
- **[PostgreSQL 16](https://www.postgresql.org)** — relational database (via Docker)
- **[NextAuth v5](https://authjs.dev)** (`5.0.0-beta.25`) — Credentials auth, JWT sessions, RBAC
- **[Tailwind CSS v4](https://tailwindcss.com)** — `@theme inline` token model
- **[Zod](https://zod.dev)** — runtime validation on every input
- **TypeScript 5** — strict mode

Defence-in-depth security: 7 HTTP security headers, RBAC across middleware /
page / action layers, IP-based rate limiting on login and contact, bcrypt
hashing (cost 12), honeypot anti-spam, and Zod schemas at every boundary.

---

## Prerequisites

| Tool             | Version                | Notes                                                  |
|------------------|------------------------|--------------------------------------------------------|
| **Node.js**      | **20.14.0** (strict)   | Do NOT upgrade to ≥ 20.19 unless you also bump Next & Prisma — see CLAUDE.md |
| **npm**          | 10.x (bundled with Node) |                                                      |
| **Docker Desktop** | Latest stable        | Used to run the PostgreSQL container                   |
| **Git**          | Any recent             |                                                        |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and set:
- `DATABASE_URL` — defaults work with the bundled Docker Compose file
- `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
- `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` — leave at `http://localhost:3000` for local dev

### 3. Start the database
```bash
docker compose up -d
```
This launches `postgres:16-alpine` on port 5432 with persisted volume
`adeo_postgres_data`. Confirm it's healthy with `docker compose ps`.

### 4. Set up Prisma
```bash
npx prisma generate          # generate the typed client
npx prisma migrate dev       # apply migrations to the running DB
npm run db:seed              # seed admin user + 7 services + 12 partners
```

### 5. Start the dev server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**.

---

## Default Admin Credentials

The seed script creates one administrator account:

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@adeo.co.th`     |
| Password | `Admin@ADEO2025!`      |
| Role     | `ADMIN`                |

Log in at **[http://localhost:3000/login](http://localhost:3000/login)** to
access the CMS at `/admin`.

> ⚠️ **Change these immediately in any non-development environment.** The
> seed credentials are public knowledge (committed to this repo).

---

## Project Structure

```
src/
├── app/
│   ├── (public)/(marketing)/   # Home, IT Solutions, Cloud, Contact (ISR 60s)
│   ├── (public)/login/         # Standalone admin login (no marketing chrome)
│   ├── (admin)/admin/          # CMS — dashboard, services, partners, inbox
│   └── api/auth/[...nextauth]/ # NextAuth route handler
├── components/
│   ├── ui/                     # Container, Button, Card, SectionHeader
│   ├── sections/               # Hero, Header, Footer, ServiceGrid, …
│   └── admin/                  # AdminSidebar, PageHeader, Table, FormField, …
├── lib/
│   ├── auth/require-admin.ts   # RBAC guards (page / action / full-admin)
│   ├── security/rate-limit.ts  # Login + contact limiters
│   ├── validations/            # Zod schemas (auth, contact, service, partner, inbox)
│   ├── upload.ts               # Local image upload to public/uploads/
│   ├── db.ts                   # Prisma singleton (HMR-safe)
│   └── services.ts             # Service-category helpers + parseFeatures
├── auth.config.ts              # Edge-safe NextAuth config (used by middleware)
├── auth.ts                     # Node-side NextAuth (Credentials + Prisma + bcrypt)
├── env.ts                      # @t3-oss/env-nextjs validation
└── middleware.ts               # /admin/* route guard
prisma/
├── schema.prisma
├── migrations/
└── seed.ts                     # tsx prisma/seed.ts
public/uploads/                 # Local file uploads (icons, partner logos)
```

---

## Available Scripts

| Script                | What it does                                        |
|-----------------------|-----------------------------------------------------|
| `npm run dev`         | Start dev server with HMR                           |
| `npm run build`       | Production build (also runs type check)             |
| `npm start`           | Run the production build                            |
| `npm run lint`        | ESLint                                              |
| `npm run db:generate` | `prisma generate`                                   |
| `npm run db:migrate`  | `prisma migrate dev`                                |
| `npm run db:push`     | `prisma db push` (skip migration history)           |
| `npm run db:seed`     | Run `prisma/seed.ts` via tsx                        |
| `npm run db:studio`   | Open Prisma Studio at port 5555                     |

---

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Comprehensive project memory: architecture
  decisions, the NextAuth Edge/Node split, OWASP layering, coding
  conventions, and the 6-step AI pipeline. **Read this before any
  significant change.**
- **[AGENTS.md](./AGENTS.md)** — Note for AI agents: this Next.js version
  has breaking changes from the typical training-data baseline.

---

## Brand Colors

| Token            | Hex       | Usage                                       |
|------------------|-----------|---------------------------------------------|
| **Navy**         | `#0A1628` | Hero backgrounds, footer, admin sidebar     |
| **Electric Blue**| `#0066FF` | Primary buttons, links, focus rings         |
| **Light Blue**   | `#3385FF` | Accents on dark backgrounds                 |

---

## License

Proprietary — © ADEO Solution. All rights reserved.
