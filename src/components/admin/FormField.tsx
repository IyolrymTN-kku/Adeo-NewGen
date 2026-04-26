import { cn } from "@/lib/utils";

const inputBase =
  "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const inputOk =
  "border-slate-300 focus:border-[#0066ff] focus:ring-[#0066ff]/20";

const inputError =
  "border-red-300 focus:border-red-500 focus:ring-red-500/20";

export function inputClass(hasError: boolean, extra?: string) {
  return cn(inputBase, hasError ? inputError : inputOk, extra);
}

type LabelProps = {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
};

export function FieldLabel({
  htmlFor,
  required,
  children,
  description,
}: LabelProps) {
  return (
    <div className="mb-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-800"
      >
        {children}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {description && (
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-600">
      {error}
    </p>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
