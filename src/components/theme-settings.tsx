"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, Settings, X } from "lucide-react";

type AdminTheme = {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  success: string;
};

const defaultTheme: AdminTheme = {
  primary: "#2563EB",
  secondary: "#1E40AF",
  accent: "#60A5FA",
  muted: "#EFF6FF",
  success: "#22C55E",
};

function hexToHslValue(hex: string) {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
    l * 100
  )}%`;
}

function getReadableTextColor(hex: string) {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const toLinear = (value: number) =>
    value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);

  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance > 0.45 ? "#0F172A" : "#FFFFFF";
}

function getGradient(theme: AdminTheme) {
  return `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 52%, ${theme.secondary} 100%)`;
}

function getGradientDark(theme: AdminTheme) {
  return `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.primary} 55%, ${theme.accent} 100%)`;
}

function getGradientSoft(theme: AdminTheme) {
  return `linear-gradient(135deg, color-mix(in srgb, ${theme.primary} 14%, white) 0%, color-mix(in srgb, ${theme.accent} 12%, white) 52%, color-mix(in srgb, ${theme.secondary} 10%, white) 100%)`;
}

function applyAdminTheme(theme: AdminTheme) {
  const root = document.documentElement;

  const primaryForeground = getReadableTextColor(theme.primary);
  const secondaryForeground = getReadableTextColor(theme.secondary);
  const accentForeground = getReadableTextColor(theme.accent);
  const mutedForeground = getReadableTextColor(theme.muted);
  const successForeground = getReadableTextColor(theme.success);
  const gradientForeground = getReadableTextColor(theme.primary);
  const sidebarForeground = getReadableTextColor(theme.secondary);

  root.style.setProperty("--admin-primary", theme.primary);
  root.style.setProperty("--admin-secondary", theme.secondary);
  root.style.setProperty("--admin-accent", theme.accent);
  root.style.setProperty("--admin-muted", theme.muted);
  root.style.setProperty("--admin-success", theme.success);

  root.style.setProperty("--admin-primary-foreground", primaryForeground);
  root.style.setProperty("--admin-secondary-foreground", secondaryForeground);
  root.style.setProperty("--admin-accent-foreground", accentForeground);
  root.style.setProperty("--admin-muted-foreground", mutedForeground);
  root.style.setProperty("--admin-success-foreground", successForeground);
  root.style.setProperty("--admin-gradient-foreground", gradientForeground);
  root.style.setProperty("--admin-sidebar-foreground", sidebarForeground);

  root.style.setProperty("--admin-gradient", getGradient(theme));
  root.style.setProperty("--admin-gradient-soft", getGradientSoft(theme));
  root.style.setProperty("--admin-gradient-dark", getGradientDark(theme));

  root.style.setProperty("--primary", hexToHslValue(theme.primary));
  root.style.setProperty(
    "--primary-foreground",
    hexToHslValue(primaryForeground)
  );

  root.style.setProperty("--ring", hexToHslValue(theme.primary));

  root.style.setProperty("--secondary", hexToHslValue(theme.secondary));
  root.style.setProperty(
    "--secondary-foreground",
    hexToHslValue(secondaryForeground)
  );

  root.style.setProperty("--accent", hexToHslValue(theme.muted));
  root.style.setProperty("--accent-foreground", hexToHslValue(mutedForeground));
}

export function ThemeSettings() {
  const [open, setOpen] = useState(false);
  const [draftTheme, setDraftTheme] = useState<AdminTheme>(defaultTheme);

  const draftGradient = getGradient(draftTheme);
  const draftForeground = getReadableTextColor(draftTheme.primary);

  useEffect(() => {
    const savedTheme = localStorage.getItem("adeo-admin-theme");

    if (!savedTheme) {
      applyAdminTheme(defaultTheme);
      return;
    }

    try {
      const parsedTheme = JSON.parse(savedTheme) as AdminTheme;
      setDraftTheme(parsedTheme);
      applyAdminTheme(parsedTheme);
    } catch {
      applyAdminTheme(defaultTheme);
    }
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      const data = event.data;

      if (data?.type !== "ADEO_THEME_PALETTE_UPDATE") return;
      if (!Array.isArray(data.palette)) return;

      const palette = data.palette as string[];

      const nextTheme: AdminTheme = {
        primary: palette[0] ?? defaultTheme.primary,
        secondary: palette[1] ?? defaultTheme.secondary,
        accent: palette[2] ?? defaultTheme.accent,
        muted: palette[3] ?? defaultTheme.muted,
        success: palette[4] ?? defaultTheme.success,
      };

      setDraftTheme(nextTheme);

      // ให้สีหน้า admin preview เปลี่ยนทันทีตอนเลือก palette
      // ถ้าอยากให้เปลี่ยนเฉพาะตอนกด Save ให้ลบบรรทัดนี้ออก
      applyAdminTheme(nextTheme);
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  function saveTheme() {
    applyAdminTheme(draftTheme);
    localStorage.setItem("adeo-admin-theme", JSON.stringify(draftTheme));
    setOpen(false);
  }

  function resetTheme() {
    setDraftTheme(defaultTheme);
    applyAdminTheme(defaultTheme);
    localStorage.setItem("adeo-admin-theme", JSON.stringify(defaultTheme));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center bg-transparent p-0 shadow-none transition hover:scale-110"
        aria-label="Open theme settings"
        title="Theme Settings"
      >
        <Settings
          className="h-8 w-8"
          style={{
            color: "transparent",
            stroke: "url(#adeoSettingsGradient)",
            filter: "drop-shadow(0 4px 10px rgba(15, 23, 42, 0.16))",
          }}
        />

        <svg width="0" height="0" aria-hidden="true">
          <linearGradient
            id="adeoSettingsGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={draftTheme.primary} />
            <stop offset="55%" stopColor={draftTheme.accent} />
            <stop offset="100%" stopColor={draftTheme.secondary} />
          </linearGradient>
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"
            aria-label="Close theme settings"
          />

          <aside className="absolute bottom-3 right-3 top-3 flex w-[min(1280px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-none border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.18)]">
            

            <div className="flex-1 bg-white">
              <iframe
                title="ADEO Theme Customizer"
                src="/theme/color-theme-thai.html"
                className="h-full w-full border-0 bg-white"
              />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                {Object.values(draftTheme).map((color) => (
                  <span
                    key={color}
                    className="h-8 w-8 rounded-none border border-slate-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetTheme}
                  className="inline-flex items-center gap-2 rounded-none border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-none border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveTheme}
                  className="inline-flex items-center gap-2 rounded-none px-6 py-3 text-sm font-bold shadow-lg transition hover:opacity-90"
                  style={{
                    background: draftGradient,
                    color: draftForeground,
                    boxShadow: `0 14px 30px color-mix(in srgb, ${draftTheme.primary} 28%, transparent)`,
                  }}
                >
                  <Check className="h-4 w-4" />
                  Save Theme
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}