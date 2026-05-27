"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import {
  hexToHslTriple,
  saveAdeoTheme,
  getReadableTextColorHsl,
  getMutedReadableTextColorHsl,
} from "@/lib/theme";

const paletteKeys = [
  "primary",
  "secondary",
  "accent",
  "muted",
  "success",
] as const;

type PaletteKey = (typeof paletteKeys)[number];

type ComponentColorTarget =
  | "header.background"
  | "header.text"
  | "header.activeNav"
  | "header.ctaBackground"
  | "header.panelBackground"
  | "sections.cardAccent"
  | "cta.background"
  | "footer.background"
  | "buttons.background";

type ComponentColorMap = Record<ComponentColorTarget, PaletteKey>;

type AdminTheme = Record<PaletteKey, string> & {
  componentColors: ComponentColorMap;
};

const STORAGE_KEY = "adeo-admin-theme";
const HEADER_RESET_KEY = "adeo-site-header-reset-white";

const PALETTE_IFRAME_MIN_HEIGHT = 920;
const PALETTE_IFRAME_MAX_WIDTH = 1120;

const defaultComponentColors: ComponentColorMap = {
  "header.background": "muted",
  "header.text": "secondary",

  "header.activeNav": "accent",
  "header.ctaBackground": "primary",
  "header.panelBackground": "secondary",
  "sections.cardAccent": "primary",
  "cta.background": "secondary",
  "footer.background": "secondary",
  "buttons.background": "primary",
};

const defaultTheme: AdminTheme = {
  primary: "#0066FF",
  secondary: "#0A1628",
  accent: "#3385FF",
  muted: "#EFF6FF",
  success: "#22C55E",
  componentColors: defaultComponentColors,
};

const componentTargetLabels: Record<ComponentColorTarget, string> = {
  "header.background": "Header background",
  "header.text": "Header text / logo (auto contrast)",
  "header.activeNav": "Header active menu",
  "header.ctaBackground": "Header CTA button",
  "header.panelBackground": "Header info panel",
  "sections.cardAccent": "Section / cards accent",
  "cta.background": "Hero / CTA background",
  "footer.background": "Footer background",
  "buttons.background": "Public buttons",
};

function isValidHex(hex: unknown): hex is string {
  return typeof hex === "string" && /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function isValidPaletteKey(value: unknown): value is PaletteKey {
  return (
    typeof value === "string" && paletteKeys.includes(value as PaletteKey)
  );
}

function normalizeComponentColors(value: unknown): ComponentColorMap {
  if (!value || typeof value !== "object") {
    return defaultComponentColors;
  }

  const raw = value as Partial<Record<ComponentColorTarget, unknown>>;

  return {
    "header.background": isValidPaletteKey(raw["header.background"])
      ? raw["header.background"]
      : defaultComponentColors["header.background"],

    "header.text": isValidPaletteKey(raw["header.text"])
      ? raw["header.text"]
      : defaultComponentColors["header.text"],

    "header.activeNav": isValidPaletteKey(raw["header.activeNav"])
      ? raw["header.activeNav"]
      : defaultComponentColors["header.activeNav"],

    "header.ctaBackground": isValidPaletteKey(raw["header.ctaBackground"])
      ? raw["header.ctaBackground"]
      : defaultComponentColors["header.ctaBackground"],

    "header.panelBackground": isValidPaletteKey(raw["header.panelBackground"])
      ? raw["header.panelBackground"]
      : defaultComponentColors["header.panelBackground"],

    "sections.cardAccent": isValidPaletteKey(raw["sections.cardAccent"])
      ? raw["sections.cardAccent"]
      : defaultComponentColors["sections.cardAccent"],

    "cta.background": isValidPaletteKey(raw["cta.background"])
      ? raw["cta.background"]
      : defaultComponentColors["cta.background"],

    "footer.background": isValidPaletteKey(raw["footer.background"])
      ? raw["footer.background"]
      : defaultComponentColors["footer.background"],

    "buttons.background": isValidPaletteKey(raw["buttons.background"])
      ? raw["buttons.background"]
      : defaultComponentColors["buttons.background"],
  };
}

function normalizeAdminTheme(value: unknown): AdminTheme | null {
  if (!value || typeof value !== "object") return null;

  const theme = value as Partial<AdminTheme>;

  if (
    !isValidHex(theme.primary) ||
    !isValidHex(theme.secondary) ||
    !isValidHex(theme.accent) ||
    !isValidHex(theme.muted) ||
    !isValidHex(theme.success)
  ) {
    return null;
  }

  return {
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    muted: theme.muted,
    success: theme.success,
    componentColors: normalizeComponentColors(theme.componentColors),
  };
}

function isValidAdminTheme(value: unknown): value is AdminTheme {
  return normalizeAdminTheme(value) !== null;
}

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

    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (max === g) h = (b - r) / d + 2;
    if (max === b) h = (r - g) / d + 4;

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

function getPaletteColor(theme: AdminTheme, key: PaletteKey) {
  return theme[key];
}

function getComponentColor(theme: AdminTheme, target: ComponentColorTarget) {
  return getPaletteColor(theme, theme.componentColors[target]);
}

function readCssVariable(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

function getPublicHeaderPreviewColors(theme: AdminTheme) {
  const resetHeaderWhite =
    typeof window !== "undefined" &&
    localStorage.getItem(HEADER_RESET_KEY) === "true";

  const fallbackHeaderBackground = getComponentColor(
    theme,
    "header.background"
  );

  const headerBackground = resetHeaderWhite
    ? "#FFFFFF"
    : readCssVariable("--site-header-bg", fallbackHeaderBackground);

  const headerText = resetHeaderWhite
    ? "#0F172A"
    : readCssVariable(
        "--site-header-text",
        getReadableTextColor(headerBackground)
      );

  const headerActiveNav = readCssVariable(
    "--site-header-active-nav",
    getComponentColor(theme, "header.activeNav")
  );

  const headerCtaBackground = readCssVariable(
    "--site-header-cta-bg",
    getComponentColor(theme, "header.ctaBackground")
  );

  const headerCtaText = readCssVariable(
    "--site-header-cta-text",
    getReadableTextColor(headerCtaBackground)
  );

  const headerPanelBackground = readCssVariable(
    "--site-header-panel-bg",
    getComponentColor(theme, "header.panelBackground")
  );

  return {
    headerBackground,
    headerText,
    headerActiveNav,
    headerCtaBackground,
    headerCtaText,
    headerPanelBackground,
    headerPanelText: getReadableTextColor(headerPanelBackground),
  };
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

function applySiteThemeFromAdminTheme(theme: AdminTheme) {
  saveAdeoTheme({
    primary: hexToHslTriple(theme.primary),
    primaryForeground: "0 0% 100%",

    heroBg: hexToHslTriple(getComponentColor(theme, "cta.background")),
    heroForeground: getReadableTextColorHsl(
      getComponentColor(theme, "cta.background")
    ),
    heroMutedForeground: getMutedReadableTextColorHsl(
      getComponentColor(theme, "cta.background")
    ),

    background: "0 0% 100%",
    foreground: "222 47% 11%",

    adminSidebar: hexToHslTriple(theme.secondary),
    adminSidebarActive: hexToHslTriple(theme.accent),
  });
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

  const headerBg = getComponentColor(theme, "header.background");
  const headerText = getReadableTextColor(headerBg);
  const headerActiveNav = getComponentColor(theme, "header.activeNav");
  const headerCtaBg = getComponentColor(theme, "header.ctaBackground");
  const headerPanelBg = getComponentColor(theme, "header.panelBackground");
  const sectionAccent = getComponentColor(theme, "sections.cardAccent");
  const ctaBg = getComponentColor(theme, "cta.background");
  const footerBg = getComponentColor(theme, "footer.background");
  const buttonBg = getComponentColor(theme, "buttons.background");
  const buttonText = getReadableTextColor(buttonBg);

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
  root.style.setProperty("--admin-gradient-dark", getGradientDark(theme));
  root.style.setProperty("--admin-gradient-soft", getGradientSoft(theme));

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

  root.style.setProperty("--hero-bg", hexToHslValue(ctaBg));
  root.style.setProperty(
    "--hero-foreground",
    hexToHslValue(getReadableTextColor(ctaBg))
  );
  root.style.setProperty(
    "--hero-muted-foreground",
    hexToHslValue(getReadableTextColor(ctaBg))
  );

  root.style.setProperty("--site-header-bg", headerBg);
  root.style.setProperty("--site-header-text", headerText);
  root.style.setProperty("--site-header-active-nav", headerActiveNav);
  root.style.setProperty("--site-header-cta-bg", headerCtaBg);
  root.style.setProperty(
    "--site-header-cta-text",
    getReadableTextColor(headerCtaBg)
  );
  root.style.setProperty("--site-header-panel-bg", headerPanelBg);

  root.style.setProperty("--site-section-accent", sectionAccent);
  root.style.setProperty(
    "--site-section-accent-text",
    getReadableTextColor(sectionAccent)
  );

  root.style.setProperty("--site-cta-bg", ctaBg);
  root.style.setProperty("--site-cta-text", getReadableTextColor(ctaBg));
  root.style.setProperty("--cta-bg", ctaBg);
  root.style.setProperty("--cta-text", getReadableTextColor(ctaBg));

  root.style.setProperty("--site-footer-bg", footerBg);
  root.style.setProperty("--site-footer-text", getReadableTextColor(footerBg));

  root.style.setProperty("--site-button-bg", buttonBg);
  root.style.setProperty("--site-button-text", buttonText);
  root.style.setProperty(
    "--site-button-bg-hover",
    `color-mix(in srgb, ${buttonBg} 88%, black)`
  );
  root.style.setProperty(
    "--site-button-border",
    `color-mix(in srgb, ${buttonBg} 76%, black)`
  );
}

function persistTheme(theme: AdminTheme) {
  applyAdminTheme(theme);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  applySiteThemeFromAdminTheme(theme);

  window.dispatchEvent(new CustomEvent("ADEO_ADMIN_THEME_CHANGED"));

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel("adeo-admin-theme-sync");

    channel.postMessage({
      type: "ADEO_ADMIN_THEME_CHANGED",
      theme,
    });

    channel.close();
  }
}

function DashboardPreview({
  theme,
  selectedTarget,
  onSelectTarget,
  onAssignTargetColor,
}: {
  theme: AdminTheme;
  selectedTarget: ComponentColorTarget;
  onSelectTarget: (target: ComponentColorTarget) => void;
  onAssignTargetColor: (
    target: ComponentColorTarget,
    paletteKey: PaletteKey
  ) => void;
}) {
   const [activeTab, setActiveTab] = useState<
    "header" | "sections" | "cta" | "footer"
  >("header");


  const primaryText = getReadableTextColor(theme.primary);

 const publicHeaderColors = getPublicHeaderPreviewColors(theme);

const headerBackground = publicHeaderColors.headerBackground;
const headerText = publicHeaderColors.headerText;
const headerActiveNav = publicHeaderColors.headerActiveNav;
const headerCtaBackground = publicHeaderColors.headerCtaBackground;
const headerPanelBackground = publicHeaderColors.headerPanelBackground;

  const sectionCardAccent = getComponentColor(theme, "sections.cardAccent");
  const ctaBackground = getComponentColor(theme, "cta.background");
  const footerBackground = getComponentColor(theme, "footer.background");
  const buttonBackground = getComponentColor(theme, "buttons.background");
  const buttonText = getReadableTextColor(buttonBackground);

const headerCtaText = publicHeaderColors.headerCtaText;
const headerPanelText = publicHeaderColors.headerPanelText;
  const ctaText = getReadableTextColor(ctaBackground);
  const footerText = getReadableTextColor(footerBackground);

  const ctaMutedText =
    ctaText === "#FFFFFF" ? "rgba(255,255,255,0.72)" : "rgba(15,23,42,0.72)";

  const footerMutedText =
    footerText === "#FFFFFF" ? "rgba(255,255,255,0.72)" : "rgba(15,23,42,0.72)";

  const tabs = [
    { id: "header", label: "Header" },
    { id: "sections", label: "Sections" },
    { id: "cta", label: "CTASection" },
    { id: "footer", label: "Footer" },
  ] as const;

  function selectedOutline(target: ComponentColorTarget) {
    return selectedTarget === target ? `3px solid ${theme.primary}` : "none";
  }

  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl sm:p-5">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: theme.primary }}
          />

          <h2 className="text-sm font-black uppercase tracking-[0.22em] text-slate-600">
            Website Component Preview
          </h2>
        </div>

        <p className="text-xs font-bold tracking-wide text-slate-400">
          Before Save
        </p>
      </div>

      <div className="mb-7 flex flex-wrap items-center gap-3 sm:gap-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="cursor-pointer rounded-2xl px-5 py-2.5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-slate-50 sm:px-7"
              style={{
                backgroundColor: isActive ? theme.primary : "transparent",
                color: isActive ? primaryText : "#475569",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-sm sm:p-5">

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Component Color Mapping
            </p>

            <h3 className="mt-1 text-base font-black text-slate-950">
              Editing: {componentTargetLabels[selectedTarget]}
            </h3>
          </div>

          <p className="rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
            ใช้สีจาก preset set นี้
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {paletteKeys.map((paletteKey) => {
            const color = theme[paletteKey];
            const isActive =
              theme.componentColors[selectedTarget] === paletteKey;

            return (
              <button
                key={paletteKey}
                type="button"
                onClick={() => onAssignTargetColor(selectedTarget, paletteKey)}
                className="cursor-pointer min-h-[74px] rounded-2xl p-4 text-left text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  backgroundColor: color,
                  color: getReadableTextColor(color),
                  outline: isActive
                    ? `3px solid color-mix(in srgb, ${theme.secondary} 60%, white)`
                    : "none",
                }}
              >
                <span className="block capitalize">{paletteKey}</span>
                <span className="mt-1 block text-xs opacity-75">{color}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        {activeTab === "header" && (
          <section
            className="cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/70 shadow-sm transition hover:ring-2 hover:ring-primary/30"
            style={{
              backgroundColor: headerBackground,
              color: headerText,
              outline: selectedOutline("header.background"),
            }}
            onClick={() => onSelectTarget("header.background")}
          >
            <div
              className="flex cursor-pointer items-center justify-between gap-4 border-b px-6 py-5"
              style={{
                borderColor:
                  headerText === "#FFFFFF"
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(15,23,42,0.14)",
              }}
            >
              <div>
                <p className="text-lg font-black" style={{ color: headerText }}>
                  ADEO Solution
                </p>

                <p
                  className="mt-1 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color:
                      headerText === "#FFFFFF"
                        ? "rgba(255,255,255,0.68)"
                        : "rgba(15,23,42,0.55)",
                  }}
                >
                  Header Component
                </p>
              </div>

              <nav
                className="hidden items-center gap-6 text-sm font-bold xl:flex"
                style={{ color: headerText }}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectTarget("header.activeNav");
                  }}
                  className="cursor-pointer relative rounded-lg px-2 py-1"
                  style={{ outline: selectedOutline("header.activeNav") }}
                >
                  Home
                  <span
                    className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full"
                    style={{ backgroundColor: headerActiveNav }}
                  />
                </button>

                <span>IT Solutions</span>
                <span>Cloud Services</span>
                <span>Contact</span>
              </nav>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectTarget("header.ctaBackground");
                }}
                className="cursor-pointer rounded-2xl px-5 py-3 text-sm font-black shadow-sm"

                style={{
                  backgroundColor: headerCtaBackground,
                  color: headerCtaText,
                  outline: selectedOutline("header.ctaBackground"),
                }}
              >
                Get a Quote
              </button>
            </div>

            <div className="px-6 py-6">
              <div
               className="cursor-pointer rounded-3xl border p-6"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectTarget("header.panelBackground");
                }}
                style={{
                  backgroundColor: headerPanelBackground,
                  color: headerPanelText,
                  borderColor:
                    headerPanelText === "#FFFFFF"
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(15,23,42,0.12)",
                  outline: selectedOutline("header.panelBackground"),
                }}
              >
                <p className="text-sm font-black">Header uses:</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {["Active tab", "CTA button", "Panel background"].map(
                    (label, index) => (
                      <div key={label} className="rounded-2xl bg-white/85 p-4 shadow-sm">
                        <p className="text-xs font-bold text-slate-400">{label}</p>
                        <div
                          className="mt-3 h-8 rounded-xl"
                          style={{
                            backgroundColor:
                              index === 0
                                ? headerActiveNav
                                : index === 1
                                ? headerCtaBackground
                                : headerPanelBackground,
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "sections" && (
          <section className="rounded-[1.75rem] border border-white/70 bg-white px-8 py-9 shadow-sm">
            <div className="mb-8 text-center">
              <p
                className="text-xs font-black uppercase tracking-[0.22em]"
                style={{ color: sectionCardAccent }}
              >
                What we do
              </p>

              <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Two pillars. One trusted partner.
              </h3>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                Click the card accent or public button card to assign another
                color from the selected preset set.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-4">
              {["ServiceGrid", "StatsBar", "PartnerGrid", "Public Buttons"].map(
                (title) => {
                  const isButtonCard = title === "Public Buttons";
                  const target: ComponentColorTarget = isButtonCard
                    ? "buttons.background"
                    : "sections.cardAccent";
                  const cardColor = isButtonCard
                    ? buttonBackground
                    : sectionCardAccent;
                  const cardText = getReadableTextColor(cardColor);

                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => onSelectTarget(target)}
                      className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30"
                      style={{ outline: selectedOutline(target) }}
                    >
                      <div
                        className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-black"
                        style={{ backgroundColor: cardColor, color: cardText }}
                      >
                        {isButtonCard ? "B" : "✓"}
                      </div>

                      <h4 className="text-base font-black text-slate-950">
                        {title}
                      </h4>

                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {isButtonCard
                          ? "Controls public CTA and form button color."
                          : "Accent, icon, stat, and card highlight color."}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </section>
        )}

        {activeTab === "cta" && (
          <section
            onClick={() => onSelectTarget("cta.background")}
            className="cursor-pointer rounded-[1.75rem] px-8 py-14 text-center shadow-sm transition hover:ring-2 hover:ring-primary/30"
            style={{
              backgroundColor: ctaBackground,
              color: ctaText,
              outline: selectedOutline("cta.background"),
            }}
          >
            <p
              className="text-xs font-black uppercase tracking-[0.22em]"
              style={{ color: theme.primary }}
            >
              Get started
            </p>

            <h3 className="mt-4 text-4xl font-black tracking-tight">
              Ready to modernise your IT?
            </h3>

            <p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed"
              style={{ color: ctaMutedText }}
            >
              Let’s scope a roadmap that meets your timelines, budget, and
              compliance reality.
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelectTarget("buttons.background");
              }}
              className="cursor-pointer mt-8 rounded-2xl px-6 py-3 text-sm font-black shadow-sm"

              style={{
                backgroundColor: buttonBackground,
                color: buttonText,
                outline: selectedOutline("buttons.background"),
              }}
            >
              Start a Conversation
            </button>
          </section>
        )}

        {activeTab === "footer" && (
          <footer
            onClick={() => onSelectTarget("footer.background")}
            className="cursor-pointer rounded-[1.75rem] px-7 py-10 shadow-sm transition hover:ring-2 hover:ring-primary/30 sm:px-10 lg:px-12"
            style={{
              backgroundColor: footerBackground,
              color: footerMutedText,
              outline: selectedOutline("footer.background"),
            }}
          >
            <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
              <div>
                <p className="text-xl font-black" style={{ color: footerText }}>
                  ADEO Solution
                </p>

                <p className="mt-5 max-w-sm text-base leading-relaxed">
                  Enterprise IT Solutions and Cloud Services.
                </p>
              </div>

              {["Solutions", "Company", "Legal"].map((heading) => (
                <div key={heading}>
                  <h4
                    className="text-xs font-black uppercase tracking-[0.24em]"
                    style={{ color: footerText }}
                  >
                    {heading}
                  </h4>

                  <ul className="mt-5 space-y-3 text-sm">
                    <li>IT Solutions</li>
                    <li>Cloud Services</li>
                    <li>Contact</li>
                  </ul>
                </div>
              ))}
            </div>
          </footer>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {paletteKeys.map((key) => {
          const value = theme[key];

          return (
            <div
              key={key}
             className="cursor-pointer min-h-[104px] rounded-[1.35rem] p-5 shadow-sm"

              style={{
                backgroundColor: value,
                color: getReadableTextColor(value),
              }}
            >
              <div className="mb-6 h-9 w-9 rounded-full bg-black/10" />

              <p className="text-sm font-black capitalize">{key}</p>

              <p className="mt-1 text-xs font-semibold opacity-70">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ThemeSettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [draftTheme, setDraftTheme] = useState<AdminTheme>(defaultTheme);
  const [iframeVersion, setIframeVersion] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(PALETTE_IFRAME_MIN_HEIGHT);
  const [selectedTarget, setSelectedTarget] =
    useState<ComponentColorTarget>("header.background");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeResizeObserverRef = useRef<ResizeObserver | null>(null);
  const iframeMeasureTimeoutsRef = useRef<number[]>([]);
  const ignoreIframeMessagesUntilRef = useRef(0);

  const draftGradient = useMemo(() => getGradient(draftTheme), [draftTheme]);

  const draftForeground = useMemo(
    () => getReadableTextColor(draftTheme.primary),
    [draftTheme.primary]
  );

  const clearIframeMeasureTimers = useCallback(() => {
    iframeMeasureTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });

    iframeMeasureTimeoutsRef.current = [];
  }, []);

  const resizeIframeToContent = useCallback(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    try {
      const iframeDocument =
        iframe.contentDocument ?? iframe.contentWindow?.document;

      if (!iframeDocument) return;

      const html = iframeDocument.documentElement;
      const body = iframeDocument.body;

      if (html) {
        html.style.height = "auto";
        html.style.overflow = "visible";
      }

      if (body) {
        body.style.height = "auto";
        body.style.overflow = "visible";
      }

      iframe.style.overflow = "hidden";

      const nextHeight = Math.ceil(
        Math.max(
          PALETTE_IFRAME_MIN_HEIGHT,
          html?.scrollHeight ?? 0,
          html?.offsetHeight ?? 0,
          html?.clientHeight ?? 0,
          body?.scrollHeight ?? 0,
          body?.offsetHeight ?? 0,
          body?.clientHeight ?? 0
        )
      );

      setIframeHeight((currentHeight) => {
        if (Math.abs(currentHeight - nextHeight) <= 2) {
          return currentHeight;
        }

        return nextHeight;
      });
    } catch {
      setIframeHeight(PALETTE_IFRAME_MIN_HEIGHT);
    }
  }, []);

  const scheduleIframeMeasurements = useCallback(() => {
    clearIframeMeasureTimers();

    [0, 100, 250, 500, 1000, 1600].forEach((delay) => {
      const timeoutId = window.setTimeout(resizeIframeToContent, delay);

      iframeMeasureTimeoutsRef.current.push(timeoutId);
    });
  }, [clearIframeMeasureTimers, resizeIframeToContent]);

  const handleIframeLoad = useCallback(() => {
    iframeResizeObserverRef.current?.disconnect();
    iframeResizeObserverRef.current = null;

    scheduleIframeMeasurements();

    const iframe = iframeRef.current;

    if (!iframe) return;

    try {
      const iframeDocument =
        iframe.contentDocument ?? iframe.contentWindow?.document;

      if (!iframeDocument) return;

      const hideSavePaletteButton = () => {
        const buttons = Array.from(iframeDocument.querySelectorAll("button"));

        buttons.forEach((button) => {
          if (button.textContent?.includes("Save Palette")) {
            button.style.display = "none";
          }
        });
      };

      const applyReadablePaletteTypography = () => {
        const styleId = "adeo-readable-palette-typography";
        let styleTag = iframeDocument.getElementById(
          styleId
        ) as HTMLStyleElement | null;

        if (!styleTag) {
          styleTag = iframeDocument.createElement("style");
          styleTag.id = styleId;
          iframeDocument.head.appendChild(styleTag);
        }

        styleTag.textContent = `
          html,
          body {
            text-size-adjust: 100% !important;
            -webkit-text-size-adjust: 100% !important;
          }

          html,
          body {
            width: 100% !important;
            min-width: 0 !important;
            overflow-x: hidden !important;
            text-size-adjust: 100% !important;
            -webkit-text-size-adjust: 100% !important;
          }

          body {
            margin-left: auto !important;
            margin-right: auto !important;
            font-size: 16px !important;
            line-height: 1.45 !important;
          }

          body > * {
            max-width: 100% !important;
          }

          [class*="grid-cols-5"],
          [class*="grid-cols-4"],
          [class*="grid-cols-3"],
          [class*="lg:grid-cols-"],
          [class*="xl:grid-cols-"],
          [class*="2xl:grid-cols-"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          @media (max-width: 900px) {
            [class*="grid-cols-5"],
            [class*="grid-cols-4"],
            [class*="grid-cols-3"],
            [class*="md:grid-cols-"],
            [class*="lg:grid-cols-"],
            [class*="xl:grid-cols-"],
            [class*="2xl:grid-cols-"] {
              grid-template-columns: 1fr !important;
            }
          }

          h1,
          .title,
          [class*="title"],
          [class*="headline"] {
            line-height: 0.95 !important;
            letter-spacing: -0.04em !important;
          }

          h2,
          h3,
          label,
          button,
          input,
          textarea,
          select,
          p,
          span,
          small {
            line-height: 1.35 !important;
          }

          button,
          input,
          textarea,
          select {
            font-size: max(13px, 0.95rem) !important;
          }

          [class*="tracking"],
          [style*="letter-spacing"] {
            letter-spacing: 0.08em !important;
          }

          [class*="text-xs"] {
            font-size: 12px !important;
            line-height: 1.35 !important;
          }

          [class*="text-sm"] {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }

          [class*="text-base"] {
            font-size: 15px !important;
            line-height: 1.45 !important;
          }

          [class*="text-lg"] {
            font-size: 17px !important;
            line-height: 1.35 !important;
          }

          [class*="text-xl"] {
            font-size: 20px !important;
            line-height: 1.25 !important;
          }

          [class*="text-2xl"],
          [class*="text-3xl"] {
            font-size: 24px !important;
            line-height: 1.15 !important;
          }

          [class*="text-4xl"],
          [class*="text-5xl"] {
            font-size: 42px !important;
            line-height: 0.95 !important;
          }

          [class*="text-6xl"],
          [class*="text-7xl"],
          [class*="text-8xl"],
          [class*="text-9xl"] {
            font-size: 58px !important;
            line-height: 0.9 !important;
          }

          .palette-card,
          [class*="card"],
          [class*="chip"],
          [class*="preset"] {
            font-size: 13px !important;
          }
        `;
      };

      hideSavePaletteButton();
      applyReadablePaletteTypography();

      const refreshIframeUi = () => {
        hideSavePaletteButton();
        applyReadablePaletteTypography();
        resizeIframeToContent();
      };

      window.setTimeout(refreshIframeUi, 100);
      window.setTimeout(refreshIframeUi, 300);
      window.setTimeout(refreshIframeUi, 800);

      const observeTargets = [
        iframeDocument.documentElement,
        iframeDocument.body,
      ].filter(Boolean) as Element[];

      if ("ResizeObserver" in window && observeTargets.length > 0) {
        const observer = new ResizeObserver(() => {
          refreshIframeUi();
        });

        observeTargets.forEach((target) => observer.observe(target));
        iframeResizeObserverRef.current = observer;
      }

      if (iframeDocument.fonts?.ready) {
        void iframeDocument.fonts.ready
          .then(refreshIframeUi)
          .catch(() => undefined);
      }
    } catch {
      setIframeHeight(PALETTE_IFRAME_MIN_HEIGHT);
    }
  }, [resizeIframeToContent, scheduleIframeMeasurements]);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (!savedTheme) {
      setDraftTheme(defaultTheme);
      persistTheme(defaultTheme);
      return;
    }

    try {
      const parsedTheme = JSON.parse(savedTheme);
      const normalizedTheme = normalizeAdminTheme(parsedTheme);

      if (!normalizedTheme) {
        setDraftTheme(defaultTheme);
        persistTheme(defaultTheme);
        return;
      }

      setDraftTheme(normalizedTheme);
      persistTheme(normalizedTheme);
    } catch {
      setDraftTheme(defaultTheme);
      persistTheme(defaultTheme);
    }
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (Date.now() < ignoreIframeMessagesUntilRef.current) return;

      const data = event.data;

      if (data?.type !== "ADEO_THEME_PALETTE_UPDATE") return;
      if (!Array.isArray(data.palette)) return;

      const palette = data.palette as string[];

      localStorage.removeItem(HEADER_RESET_KEY);

      setDraftTheme((currentTheme) => {
        const nextTheme: AdminTheme = {
          ...currentTheme,
          primary: palette[0] ?? currentTheme.primary,
          secondary: palette[1] ?? currentTheme.secondary,
          accent: palette[2] ?? currentTheme.accent,
          muted: palette[3] ?? currentTheme.muted,
          success: palette[4] ?? currentTheme.success,
          componentColors: currentTheme.componentColors,
        };

        if (!isValidAdminTheme(nextTheme)) return currentTheme;

        applyAdminTheme(nextTheme);
        setSaveStatus("idle");
        window.dispatchEvent(new CustomEvent("ADEO_ADMIN_THEME_CHANGED"));

        return nextTheme;
      });

      scheduleIframeMeasurements();
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [scheduleIframeMeasurements]);

  useEffect(() => {
    return () => {
      iframeResizeObserverRef.current?.disconnect();
      clearIframeMeasureTimers();
    };
  }, [clearIframeMeasureTimers]);

  function saveTheme() {
    if (saveStatus === "saving") return;

    localStorage.removeItem(HEADER_RESET_KEY);
    window.dispatchEvent(new CustomEvent("ADEO_ADMIN_THEME_CHANGED"));

    setSaveStatus("saving");

    window.setTimeout(() => {
      persistTheme(draftTheme);
      setSaveStatus("saved");

      window.setTimeout(() => {
        setSaveStatus("idle");
      }, 1600);
    }, 250);
  }

  function resetTheme() {
    setSaveStatus("idle");

    ignoreIframeMessagesUntilRef.current = Date.now() + 1200;

    setDraftTheme(defaultTheme);
    setSelectedTarget("header.background");
    persistTheme(defaultTheme);

    localStorage.setItem(HEADER_RESET_KEY, "true");

    const root = document.documentElement;
    root.style.setProperty("--site-header-bg", "#FFFFFF");
    root.style.setProperty("--site-header-text", "#0F172A");

    window.dispatchEvent(new CustomEvent("ADEO_HEADER_RESET_WHITE"));

    setIframeVersion((version) => version + 1);

    window.setTimeout(() => {
      setDraftTheme(defaultTheme);
      setSelectedTarget("header.background");
      persistTheme(defaultTheme);

      localStorage.setItem(HEADER_RESET_KEY, "true");
      root.style.setProperty("--site-header-bg", "#FFFFFF");
      root.style.setProperty("--site-header-text", "#0F172A");

      window.dispatchEvent(new CustomEvent("ADEO_HEADER_RESET_WHITE"));
      scheduleIframeMeasurements();
    }, 80);
  }

  function updateComponentColor(
    target: ComponentColorTarget,
    paletteKey: PaletteKey
  ) {
    localStorage.removeItem(HEADER_RESET_KEY);

    setDraftTheme((currentTheme) => {
      const nextTheme: AdminTheme = {
        ...currentTheme,
        componentColors: {
          ...currentTheme.componentColors,
          [target]: paletteKey,
        },
      };

      applyAdminTheme(nextTheme);
      setSaveStatus("idle");
      window.dispatchEvent(new CustomEvent("ADEO_ADMIN_THEME_CHANGED"));

      return nextTheme;
    });
  }

  if (!isMounted) {
    return (
      <div
        className="min-h-screen overflow-x-hidden p-3 sm:p-4 lg:p-5 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--admin-primary, #0066FF) 10%, white) 0%, color-mix(in srgb, var(--admin-accent, #3385FF) 8%, white) 45%, color-mix(in srgb, var(--admin-secondary, #0A1628) 10%, white) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800" />
          <p className="text-sm font-bold text-slate-500">Loading Theme Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden p-3 sm:p-4 lg:p-5"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--admin-primary, #0066FF) 10%, white) 0%, color-mix(in srgb, var(--admin-accent, #3385FF) 8%, white) 45%, color-mix(in srgb, var(--admin-secondary, #0A1628) 10%, white) 100%)",
      }}
    >
      <main className="mx-auto max-w-[1560px] space-y-4 overflow-visible">
        <section className="rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur-xl sm:p-5">
          <div
            className="mx-auto w-full overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/40"
            style={{ maxWidth: `${PALETTE_IFRAME_MAX_WIDTH}px` }}
          >
            <iframe
              ref={iframeRef}
              key={iframeVersion}
              title="ADEO Theme Customizer"
              src={`/theme/color-theme-thai.html?v=${iframeVersion}`}
              scrolling="no"
              onLoad={handleIframeLoad}
              className="block w-full border-0 bg-transparent"
              style={{
                height: `${iframeHeight}px`,
                minHeight: `${PALETTE_IFRAME_MIN_HEIGHT}px`,
                overflow: "hidden",
              }}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Preview
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-950">
                Website preview under Presets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                เลือก Preset ด้านบน แล้วคลิกส่วนใน preview เพื่อสลับสีจาก set
                เดียวกัน
              </p>
            </div>

            <p className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
              Before Save
            </p>
          </div>

          <DashboardPreview
            theme={draftTheme}
            selectedTarget={selectedTarget}
            onSelectTarget={setSelectedTarget}
            onAssignTargetColor={updateComponentColor}
          />
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/55 px-5 py-4 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              {paletteKeys.map((key) => {
                const color = draftTheme[key];

                return (
                  <span
                    key={key}
                   className="cursor-pointer h-8 w-8 rounded-none border border-white/70 shadow-sm"

                    style={{ backgroundColor: color }}
                    title={`${key}: ${color}`}
                  />
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetTheme}
                disabled={saveStatus === "saving"}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>

              <button
                type="button"
                onClick={saveTheme}
                disabled={saveStatus === "saving"}
                className={[
                  "cursor-pointer inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition duration-200",
  "hover:opacity-90 disabled:cursor-not-allowed",
                  saveStatus === "saving" ? "scale-[0.98] opacity-80" : "",
                  saveStatus === "saved" ? "scale-[1.03]" : "",
                ].join(" ")}
                style={{
                  background:
                    saveStatus === "saved" ? draftTheme.success : draftGradient,
                  color:
                    saveStatus === "saved"
                      ? getReadableTextColor(draftTheme.success)
                      : draftForeground,
                  boxShadow:
                    saveStatus === "saved"
                      ? `0 14px 30px color-mix(in srgb, ${draftTheme.success} 32%, transparent)`
                      : `0 14px 30px color-mix(in srgb, ${draftTheme.primary} 28%, transparent)`,
                }}
              >
                {saveStatus === "saving" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : saveStatus === "saved" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Theme
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function ThemeSettings() {
  return null;
}

export default ThemeSettingsPage;