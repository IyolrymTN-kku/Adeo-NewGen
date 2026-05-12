"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(locale: string) {
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
          currentLocale === "en"
            ? "bg-[#0066ff] text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("th")}
        disabled={isPending}
        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
          currentLocale === "th"
            ? "bg-[#0066ff] text-white"
            : "text-slate-600 hover:bg-slate.100"
        }`}
      >
        TH
      </button>
    </div>
  );
}