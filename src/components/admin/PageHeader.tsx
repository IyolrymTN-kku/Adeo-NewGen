type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { href: string; label: string }[];
};

import Link from "next/link";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-white">
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
                  className="hover:text-[#0066ff] hover:underline"
                >
                  {bc.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PageBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full ${className ?? "max-w-6xl"} px-6 py-8 sm:px-8 lg:px-10`}>
      {children}
    </div>
  );
}
