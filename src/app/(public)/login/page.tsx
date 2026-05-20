import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { Logo } from "@/components/sections/Logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

const brandAccent = "var(--admin-accent, #3385FF)";
const brandMutedText = "var(--admin-sidebar-foreground, rgba(255,255,255,0.6))";

export default async function LoginPage() {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const companyName = settings?.companyName ?? "ADEO Solution";
  const logoUrl = settings?.logoUrl ?? null;

  return (
    <div className="flex min-h-screen">
      {/* ── Brand panel (left) ── */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{ backgroundColor: "var(--admin-secondary, #0A1628)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Logo invert companyName={companyName} logoUrl={logoUrl} />
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <div className="h-px w-12" style={{ backgroundColor: brandAccent }} />
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Powering the<br />digital backbone<br />of your business.
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Enterprise IT Solutions &amp; Cloud Services — secure, scalable, and built for the future.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {["Software Development", "IT Support", "Cloud Migration", "Network Infrastructure"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: brandAccent }}
              />
              <span className="text-xs" style={{ color: brandMutedText }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form panel (right) ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Logo companyName={companyName} logoUrl={logoUrl} />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Admin Portal</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to manage services, partners, and content.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <LoginForm />
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} {companyName}.
          </p>
        </div>
      </div>
    </div>
  );
}
