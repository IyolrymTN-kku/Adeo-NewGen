"use client";

/**
 * ThemeSync
 * ---------
 * Client component that reads the saved admin theme from localStorage
 * and writes it as CSS custom properties on <html>.
 *
 * This makes every component that uses var(--admin-primary), var(--cta-bg),
 * var(--footer-bg), etc. automatically reflect the latest saved theme —
 * no page reload required.
 *
 * Mount this once in your root layout (inside <body>):
 *   <ThemeSync />
 */

import { useEffect } from "react";

const THEME_STORAGE_KEY = "adeo-admin-theme";
const CHANNEL_NAME = "adeo-admin-theme-sync";

type ThemeData = {
  // Component-level color mapping (what the preview UI saves)
  componentColorMapping?: {
    header?: { background?: string; text?: string };
    footer?: { background?: string; text?: string };
    cta?: { background?: string; text?: string };
    hero?: { background?: string; text?: string };
  };

  // Flat palette fields
  primary?: string;
  primaryText?: string;
  secondary?: string;
  accent?: string;
  muted?: string;
  success?: string;

  // Admin namespace
  admin?: {
    primary?: string;
    primaryText?: string;
    secondary?: string;
    accent?: string;
  };

  // Palette namespace
  palette?: {
    primary?: string;
    primaryText?: string;
  };

  colors?: Record<string, string>;
};

function normalizeColor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const c = value.trim();
  if (!c || c === "undefined" || c === "null") return null;
  return c;
}

function pick(obj: unknown, ...paths: string[][]): string | null {
  for (const path of paths) {
    let cur: unknown = obj;
    for (const key of path) {
      if (cur && typeof cur === "object" && key in (cur as object)) {
        cur = (cur as Record<string, unknown>)[key];
      } else {
        cur = undefined;
        break;
      }
    }
    const v = normalizeColor(cur);
    if (v) return v;
  }
  return null;
}

function parseRgb(color: string): { r: number; g: number; b: number } | null {
  const v = color.trim();
  if (v.startsWith("#")) {
    const hex = v.replace("#", "");
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length >= 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }
  const m = v.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const [r, g, b] = m[1].split(",").map((p) => Number(p.trim()));
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }
  return null;
}

function getReadableTextColor(bg: string): string {
  const rgb = parseRgb(bg);
  if (!rgb) return "#0F172A";
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 170 ? "#0F172A" : "#FFFFFF";
}

function applyTheme(theme: ThemeData) {
  const root = document.documentElement;

  // ─── Primary / Brand ─────────────────────────────────────────────────────
  const primary =
    pick(theme, ["admin", "primary"], ["primary"], ["palette", "primary"], ["colors", "primary"]) ??
    "#0066FF";
  const primaryText =
    pick(theme, ["admin", "primaryText"], ["primaryText"], ["palette", "primaryText"]) ??
    getReadableTextColor(primary);

  root.style.setProperty("--admin-primary", primary);
  root.style.setProperty("--admin-primary-text", primaryText);

  // ─── Secondary / Accent ──────────────────────────────────────────────────
  const secondary = pick(theme, ["admin", "secondary"], ["secondary"], ["colors", "secondary"]);
  if (secondary) root.style.setProperty("--admin-secondary", secondary);

  const accent = pick(theme, ["admin", "accent"], ["accent"], ["colors", "accent"]);
  if (accent) root.style.setProperty("--admin-accent", accent);

  // ─── Header ──────────────────────────────────────────────────────────────
  const headerBg = pick(
    theme,
    ["componentColorMapping", "header", "background"],
    ["componentColorMapping", "header", "bg"],
  ) ?? accent ?? "#0F172A";

  const headerText =
    pick(theme, ["componentColorMapping", "header", "text"]) ??
    getReadableTextColor(headerBg);

  root.style.setProperty("--header-bg", headerBg);
  root.style.setProperty("--header-text", headerText);

  // Also set the legacy var the Header component reads
  root.style.setProperty("--site-header-bg", headerBg);

  // ─── Footer ──────────────────────────────────────────────────────────────
  const footerBg = pick(
    theme,
    ["componentColorMapping", "footer", "background"],
    ["componentColorMapping", "footer", "bg"],
  ) ?? accent ?? "#0F172A";

  const footerText =
    pick(theme, ["componentColorMapping", "footer", "text"]) ??
    getReadableTextColor(footerBg);

  root.style.setProperty("--footer-bg", footerBg);
  root.style.setProperty("--footer-text", footerText);

  // ─── CTA / Hero section ──────────────────────────────────────────────────
  const ctaBg = pick(
    theme,
    ["componentColorMapping", "cta", "background"],
    ["componentColorMapping", "cta", "bg"],
    ["componentColorMapping", "hero", "background"],
    ["componentColorMapping", "hero", "bg"],
  ) ?? accent ?? "#0F172A";

  const ctaText =
    pick(theme, ["componentColorMapping", "cta", "text"], ["componentColorMapping", "hero", "text"]) ??
    getReadableTextColor(ctaBg);

  root.style.setProperty("--cta-bg", ctaBg);
  root.style.setProperty("--cta-text", ctaText);
}

function loadAndApply() {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return;
    const parsed: ThemeData = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      applyTheme(parsed);
    }
  } catch {
    // ignore parse errors
  }
}

export function ThemeSync() {
  useEffect(() => {
    // Apply immediately on mount
    loadAndApply();

    // Listen for theme changes from the admin panel (same tab)
    function handleThemeEvent() {
      loadAndApply();
    }

    // Cross-tab sync via storage event
    function handleStorage(e: StorageEvent) {
      if (
        !e.key ||
        e.key === THEME_STORAGE_KEY ||
        e.key === "adeo-admin-theme-updated-at"
      ) {
        loadAndApply();
      }
    }

    window.addEventListener("ADEO_ADMIN_THEME_CHANGED", handleThemeEvent);
    window.addEventListener("storage", handleStorage);

    // BroadcastChannel for same-origin multi-tab sync
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (e) => {
          if (e.data?.type === "ADEO_ADMIN_THEME_CHANGED") {
            loadAndApply();
          }
        };
      }
    } catch {
      channel = null;
    }

    return () => {
      window.removeEventListener("ADEO_ADMIN_THEME_CHANGED", handleThemeEvent);
      window.removeEventListener("storage", handleStorage);
      try {
        channel?.close();
      } catch {
        // ignore
      }
    };
  }, []);

  // Render nothing — this component only has side effects
  return null;
}
