# AI Project Harness — ADEO Solution

> **This is the ultimate source of truth for all AI agents working on this
> codebase.** Every agent (Claude, Copilot, Cursor, custom) MUST read this
> file before making any non-trivial change.

---

## AI Project Pipeline (6-Step Workflow)

AI agents must follow this workflow for every task:

| Step | Name            | What happens                                                         |
|------|-----------------|----------------------------------------------------------------------|
| 1    | **Ask**         | Clarify missing requirements, identify affected modules.             |
| 2    | **Plan**        | Produce a short implementation plan, list files to modify, list risks. |
| 3    | **Implement**   | Make small, focused changes, follow existing architecture.           |
| 4    | **Review Diff** | Explain changes, highlight security/tenant/DB impact.                |
| 5    | **Run / Test**  | Run type-checks, lint, build, and relevant security tests.           |
| 6    | **Commit**      | Use clear semantic commit messages, never commit temporary debug code.|

### Rules

- **Never skip a step.** If the user explicitly fast-tracks (e.g. "just do it"),
  you may collapse Ask+Plan into one message, but still produce the plan.
- **Wait for approval** between Plan and Implement, and between Review Diff and
  Commit. Do not auto-advance.
- **Scope discipline:** Each task = one concern. If a task touches more than 3
  unrelated files, split it or get explicit approval to bundle.

---

## Verification Commands (Step 5)

```bash
rm -rf .next && npx tsc --noEmit   # Type-check (clean cache)
npm run build                      # Full production build — must exit 0
```

Both must pass before any commit. If either fails, fix before proceeding.

---

## Architecture Guardrails

These are non-negotiable constraints. See `CLAUDE.md` for full details.

1. **Node 20.14** — do not upgrade without re-evaluating Next.js/Prisma compatibility.
2. **Edge/Node split** — `middleware.ts` imports only `auth.config.ts`, never `auth.ts`.
3. **"use server" modules** — export only async functions; types go in sibling `form-state.ts`.
4. **4-layer RBAC** — never remove a guard because "another layer already covers it."
5. **Zod before Prisma** — all user input validated via schemas in `src/lib/validations/`.
6. **ISR for marketing pages** — `export const revalidate = 60`; admin mutations call `revalidatePath()`.
7. **No raw SQL** — all DB access through Prisma's parameterised queries.

---

## Performance Standards

- Marketing pages must be statically generated or ISR-cached (no unnecessary `force-dynamic`).
- Use `next/dynamic` for heavy client components not needed at first paint.
- Use `next/image` for all raster images; use `next/font` for web fonts.
- Prisma queries should use `select` to fetch only needed fields where practical.
- Avoid N+1 patterns — use `include` or batch queries.

---

## Security Standards

See `CLAUDE.md` Section 3 for full OWASP hardening details. Key rules for agents:

- Never bypass rate limiters or auth guards.
- Never log or expose secrets, tokens, or passwords.
- Never use `dangerouslySetInnerHTML` without explicit sanitization.
- File uploads: respect MIME allow-list, 5 MB cap, random filenames.

---

## Commit Convention

Format: `type(scope): description`

Types: `feat`, `fix`, `perf`, `refactor`, `docs`, `chore`, `test`

Examples:
- `feat(admin): add partner bulk-delete action`
- `perf(marketing): lazy-load partner grid below the fold`
- `fix(auth): prevent session leak on concurrent login`

---

## File Hierarchy (for agents)

```
AI_HARNESS.md    ← You are here. Ultimate source of truth for agent behavior.
CLAUDE.md        ← Full project memory: architecture, security, conventions.
AGENTS.md        ← Framework-specific warnings and rules.
```

All three files are complementary. When in conflict, this file wins.
