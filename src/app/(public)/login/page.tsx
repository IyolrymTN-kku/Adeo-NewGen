import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* ── Brand panel (left) ─────────────────────────────────────────────── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0a1628] p-12 lg:flex">
        {/* Decorative radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #0066ff 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #0066ff 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066ff]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 text-white"
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
          <span className="text-xl font-bold tracking-tight text-white">
            ADEO Solution
          </span>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <div className="h-px w-12 bg-[#0066ff]" />
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Powering the
            <br />
            digital backbone
            <br />
            of your business.
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Enterprise IT Solutions &amp; Cloud Services — secure, scalable,
            and built for the future.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            "Software Development",
            "IT Support",
            "Cloud Migration",
            "Network Infrastructure",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#0066ff]" />
              <span className="text-xs text-slate-400">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form panel (right) ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
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
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Portal
            </h2>
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
            © {new Date().getFullYear()} ADEO Solution. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
