import Link from "next/link";
import { ThemeSettings } from "@/components/theme-settings";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { href: string; label: string }[];
};

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="relative border-b border-slate-200 bg-white text-slate-950">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-2 text-xs text-slate-500"
          >
            {breadcrumbs.map((bc, i) => (
              <span key={bc.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}

                <Link
                  href={bc.href}
                  className="transition hover:text-[var(--admin-primary)] hover:underline"
                >
                  {bc.label}
                </Link>
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
                {description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 pt-1">
            {actions}
            <ThemeSettings />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl bg-white px-6 py-8 sm:px-8 lg:px-10">
      {children}
    </div>
  );
}