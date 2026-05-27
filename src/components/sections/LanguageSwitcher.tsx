"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(locale: string) {
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg p-0.5"
      style={{ border: "1px solid color-mix(in srgb, #0F172A 20%, transparent)" }}
    >
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className="rounded-md px-2.5 py-1 text-xs font-semibold transition"
        style={
          currentLocale === "en"
            ? { backgroundColor: "hsl(var(--primary))", color: "var(--admin-primary-foreground, #FFFFFF)" }
            : { color: "color-mix(in srgb, #0F172A 60%, transparent)" }
        }
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("th")}
        disabled={isPending}
        className="rounded-md px-2.5 py-1 text-xs font-semibold transition"
        style={
          currentLocale === "th"
            ? { backgroundColor: "hsl(var(--primary))", color: "var(--admin-primary-foreground, #FFFFFF)" }
            : { color: "color-mix(in srgb, #0F172A 60%, transparent)" }
        }
      >
        TH
      </button>
    </div>
  );
}