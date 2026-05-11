export type AdeoTheme = {
  primary: string;
  primaryForeground: string;
  heroBg: string;
  heroForeground: string;
  heroMutedForeground: string;
  background: string;
  foreground: string;
  adminSidebar: string;
  adminSidebarActive: string;
};

export const ADEO_THEME_STORAGE_KEY = "adeo-theme";

export const DEFAULT_ADEO_THEME: AdeoTheme = {
  primary: "226 83% 59%",
  primaryForeground: "0 0% 100%",
  heroBg: "222 47% 10%",
  heroForeground: "0 0% 100%",
  heroMutedForeground: "215 20% 75%",
  background: "0 0% 100%",
  foreground: "222 47% 11%",
  adminSidebar: "28 23% 70%",
  adminSidebarActive: "336 22% 69%",
};

export function hexToHslTriple(hex: string) {
  const clean = hex.replace("#", "");

  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (max === g) h = (b - r) / d + 2;
    if (max === b) h = (r - g) / d + 4;

    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
    l * 100
  )}%`;
}

export function getReadableTextColorHsl(hex: string) {
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

  return luminance > 0.45 ? "222 47% 11%" : "0 0% 100%";
}

export function getMutedReadableTextColorHsl(hex: string) {
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

  return luminance > 0.45 ? "222 20% 25%" : "215 20% 75%";
}

export function applyAdeoTheme(theme: AdeoTheme) {
  const root = document.documentElement;

  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-foreground", theme.primaryForeground);

  root.style.setProperty("--hero-bg", theme.heroBg);
  root.style.setProperty("--hero-foreground", theme.heroForeground);
  root.style.setProperty("--hero-muted-foreground", theme.heroMutedForeground);

  root.style.setProperty("--background", theme.background);
  root.style.setProperty("--foreground", theme.foreground);

  root.style.setProperty("--admin-sidebar", theme.adminSidebar);
  root.style.setProperty("--admin-sidebar-active", theme.adminSidebarActive);
}

export function saveAdeoTheme(theme: AdeoTheme) {
  localStorage.setItem(ADEO_THEME_STORAGE_KEY, JSON.stringify(theme));
  applyAdeoTheme(theme);
  window.dispatchEvent(new Event("adeo-theme-updated"));
}

export function loadAdeoTheme() {
  const saved = localStorage.getItem(ADEO_THEME_STORAGE_KEY);

  if (!saved) {
    applyAdeoTheme(DEFAULT_ADEO_THEME);
    return DEFAULT_ADEO_THEME;
  }

  try {
    const parsed = JSON.parse(saved) as AdeoTheme;
    applyAdeoTheme(parsed);
    return parsed;
  } catch {
    applyAdeoTheme(DEFAULT_ADEO_THEME);
    return DEFAULT_ADEO_THEME;
  }
}