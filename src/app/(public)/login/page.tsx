import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { Logo } from "@/components/sections/Logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

<<<<<<< HEAD
const brandBg = "var(--admin-secondary, #0A1628)";
const brandText = "var(--admin-secondary-foreground, #FFFFFF)";
const brandMutedText =
  "color-mix(in srgb, var(--admin-secondary-foreground, #FFFFFF) 68%, transparent)";
const brandAccent = "var(--admin-primary, #0066FF)";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* ── Brand panel (left) ─────────────────────────────────────────────── */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{
          backgroundColor: brandBg,
          color: brandText,
        }}
      >
        {/* Decorative radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${brandAccent} 0%, transparent 70%)`,
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${brandAccent} 0%, transparent 70%)`,
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9ECF0]">
            <img
              src="https://www.adeo.co.th/assets/global/images/logo_header.png"
              alt="ADEO Solution"
              className="h-7 w-auto object-contain"
            />
          </div>

          <span
            className="text-lg font-bold"
            style={{ color: brandText }}
          >
            ADEO Solution
          </span>
=======
export default async function LoginPage() {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const companyName = settings?.companyName ?? "ADEO Solution";
  const logoUrl = settings?.logoUrl ?? null;

  return (
    <div className="flex min-h-screen">
      {/* ── Brand panel (left) ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0a1628] p-12 lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)" }} />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Logo invert companyName={companyName} logoUrl={logoUrl} />
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
<<<<<<< HEAD
          <div
            className="h-px w-12"
            style={{ backgroundColor: brandAccent }}
          />

          <h1
            className="text-4xl font-bold leading-tight tracking-tight"
            style={{ color: brandText }}
          >
            Powering the
            <br />
            digital backbone
            <br />
            of your business.
          </h1>

          <p
            className="max-w-xs text-sm leading-relaxed"
            style={{ color: brandMutedText }}
          >
            Enterprise IT Solutions &amp; Cloud Services — secure, scalable,
            and built for the future.
=======
          <div className="h-px w-12 bg-[#0066ff]" />
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Powering the<br />digital backbone<br />of your business.
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Enterprise IT Solutions &amp; Cloud Services — secure, scalable, and built for the future.
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
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

              <span
                className="text-xs"
                style={{ color: brandMutedText }}
              >
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
<<<<<<< HEAD
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a1628]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-white"
                aria-hidden="true"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="text-lg font-bold text-slate-900">
              ADEO Solution
            </span>
=======
            <Logo companyName={companyName} logoUrl={logoUrl} />
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
          </div>

          {/* Heading */}
          <div className="mb-8">
<<<<<<< HEAD
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Portal
            </h2>

            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to manage services, partners, and content.
            </p>
=======
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Admin Portal</h2>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to manage services, partners, and content.</p>
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
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