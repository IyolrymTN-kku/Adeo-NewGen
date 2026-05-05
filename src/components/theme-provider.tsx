"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ColorTheme = "adeo-blue" | "ocean" | "forest" | "sunset" | "slate";

type ThemeContextValue = {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

type ThemePalette = {
  primary: string;
  heroBg: string;
  accent: string;
  muted: string;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "adeo-theme-settings";
const DEFAULT_THEME: ColorTheme = "adeo-blue";

const THEME_PALETTES: Record<ColorTheme, ThemePalette> = {
  "adeo-blue": {
    primary: "#2563eb",
    heroBg: "#071634",
    accent: "#9bbcff",
    muted: "#374151",
  },
  ocean: {
    primary: "#0891b2",
    heroBg: "#082f49",
    accent: "#a5f3fc",
    muted: "#64748b",
  },
  forest: {
    primary: "#15803d",
    heroBg: "#052e16",
    accent: "#bbf7d0",
    muted: "#4b6043",
  },
  sunset: {
    primary: "#ea580c",
    heroBg: "#581c87",
    accent: "#fb7185",
    muted: "#7c3aed",
  },
  slate: {
    primary: "#475569",
    heroBg: "#020617",
    accent: "#cbd5e1",
    muted: "#334155",
  },
};

function hexToHsl(hex: string) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

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

function isColorTheme(value: unknown): value is ColorTheme {
  return (
    value === "adeo-blue" ||
    value === "ocean" ||
    value === "forest" ||
    value === "sunset" ||
    value === "slate"
  );
}

function applyTheme(colorTheme: ColorTheme, darkMode: boolean) {
  const palette = THEME_PALETTES[colorTheme];
  const root = document.documentElement;

  root.dataset.theme = colorTheme;

  root.style.setProperty("--primary", hexToHsl(palette.primary));
  root.style.setProperty("--primary-foreground", "0 0% 100%");
  root.style.setProperty("--hero-bg", hexToHsl(palette.heroBg));
  root.style.setProperty("--theme-accent", hexToHsl(palette.accent));
  root.style.setProperty("--theme-muted", hexToHsl(palette.muted));

  root.classList.toggle("dark", darkMode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(DEFAULT_THEME);
  const [darkMode, setDarkModeState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      applyTheme(DEFAULT_THEME, false);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        colorTheme?: unknown;
        darkMode?: unknown;
      };

      const savedTheme = isColorTheme(parsed.colorTheme)
        ? parsed.colorTheme
        : DEFAULT_THEME;

      const savedDarkMode =
        typeof parsed.darkMode === "boolean" ? parsed.darkMode : false;

      setColorThemeState(savedTheme);
      setDarkModeState(savedDarkMode);
      applyTheme(savedTheme, savedDarkMode);
    } catch {
      applyTheme(DEFAULT_THEME, false);
    }
  }, []);

  useEffect(() => {
    applyTheme(colorTheme, darkMode);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        colorTheme,
        darkMode,
      })
    );
  }, [colorTheme, darkMode]);

  const value = useMemo(
    () => ({
      colorTheme,
      setColorTheme: setColorThemeState,
      darkMode,
      setDarkMode: setDarkModeState,
    }),
    [colorTheme, darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeSettings() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeSettings must be used inside ThemeProvider");
  }

  return context;
}