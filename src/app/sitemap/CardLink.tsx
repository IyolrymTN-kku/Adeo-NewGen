"use client";

import Link from "next/link";

export function CardLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:scale-[1.02] hover:shadow-md"
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = "color-mix(in srgb, var(--site-button-bg) 8%, white)";
        el.style.borderColor = "var(--site-button-bg)";
        const p = el.querySelector("p");
        if (p) p.style.color = "var(--site-button-bg)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = "";
        el.style.borderColor = "";
        const p = el.querySelector("p");
        if (p) p.style.color = "";
      }}
    >
      <p className="font-semibold text-slate-900 transition">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{desc}</p>
    </Link>
  );
}