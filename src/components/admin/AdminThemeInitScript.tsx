"use client";

import { useServerInsertedHTML } from "next/navigation";

type Props = {
  bootTimestamp?: string;
};

export function AdminThemeInitScript({ bootTimestamp = "" }: Props) {
  const script = `
(function () {
  try {
    var STORAGE_KEY = "adeo-admin-theme";
    var BOOT_KEY = "adeo-admin-theme-boot";
    var bootTimestamp = "${bootTimestamp}";

    var paletteKeys = ["primary", "secondary", "accent", "muted", "success"];

    var defaultComponentColors = {
      "header.background": "muted",
      "header.text": "secondary",
      "header.activeNav": "accent",
      "header.ctaBackground": "primary",
      "header.panelBackground": "secondary",
      "sections.cardAccent": "primary",
      "sections.cardBackground": "secondary",
      "cta.background": "secondary",
      "footer.background": "secondary",
      "buttons.background": "primary"
    };

    var defaultTheme = {
      primary: "#0066FF",
      secondary: "#0A1628",
      accent: "#3385FF",
      muted: "#EFF6FF",
      success: "#22C55E",
      componentColors: defaultComponentColors
    };

    if (bootTimestamp) {
      var savedBoot = localStorage.getItem(BOOT_KEY);
      if (savedBoot !== bootTimestamp) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTheme));
        localStorage.removeItem("adeo-theme");
        localStorage.setItem(BOOT_KEY, bootTimestamp);
      }
    }

    function isValidHex(hex) {
      return typeof hex === "string" && /^#[0-9A-Fa-f]{6}$/.test(hex);
    }

    function isValidPaletteKey(value) {
      return paletteKeys.indexOf(value) !== -1;
    }

    function normalizeComponentColors(value) {
      var raw = value && typeof value === "object" ? value : {};

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

        "sections.cardBackground": isValidPaletteKey(raw["sections.cardBackground"])
          ? raw["sections.cardBackground"]
          : defaultComponentColors["sections.cardBackground"],

        "cta.background": isValidPaletteKey(raw["cta.background"])
          ? raw["cta.background"]
          : defaultComponentColors["cta.background"],

        "footer.background": isValidPaletteKey(raw["footer.background"])
          ? raw["footer.background"]
          : defaultComponentColors["footer.background"],

        "buttons.background": isValidPaletteKey(raw["buttons.background"])
          ? raw["buttons.background"]
          : defaultComponentColors["buttons.background"]
      };
    }

    function normalizeTheme(value) {
      if (!value || typeof value !== "object") return defaultTheme;

      if (
        !isValidHex(value.primary) ||
        !isValidHex(value.secondary) ||
        !isValidHex(value.accent) ||
        !isValidHex(value.muted) ||
        !isValidHex(value.success)
      ) {
        return defaultTheme;
      }

      return {
        primary: value.primary,
        secondary: value.secondary,
        accent: value.accent,
        muted: value.muted,
        success: value.success,
        componentColors: normalizeComponentColors(value.componentColors)
      };
    }

    var savedTheme = localStorage.getItem(STORAGE_KEY);
    var theme = savedTheme ? normalizeTheme(JSON.parse(savedTheme)) : defaultTheme;
    var root = document.documentElement;

    function hexToHslValue(hex) {
      var cleanHex = hex.replace("#", "");

      var r = parseInt(cleanHex.slice(0, 2), 16) / 255;
      var g = parseInt(cleanHex.slice(2, 4), 16) / 255;
      var b = parseInt(cleanHex.slice(4, 6), 16) / 255;

      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);

      var h = 0;
      var s = 0;
      var l = (max + min) / 2;

      if (max !== min) {
        var d = max - min;
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

        h = h / 6;
      }

      return Math.round(h * 360) + " " + Math.round(s * 100) + "% " + Math.round(l * 100) + "%";
    }

    function getReadableTextColor(hex) {
      var cleanHex = hex.replace("#", "");

      var r = parseInt(cleanHex.slice(0, 2), 16) / 255;
      var g = parseInt(cleanHex.slice(2, 4), 16) / 255;
      var b = parseInt(cleanHex.slice(4, 6), 16) / 255;

      function toLinear(value) {
        return value <= 0.03928
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4);
      }

      var luminance =
        0.2126 * toLinear(r) +
        0.7152 * toLinear(g) +
        0.0722 * toLinear(b);

      return luminance > 0.45 ? "#0F172A" : "#FFFFFF";
    }

    function getGradient(theme) {
      return "linear-gradient(135deg, " + theme.primary + " 0%, " + theme.accent + " 52%, " + theme.secondary + " 100%)";
    }

    function getGradientSoft(theme) {
      return "linear-gradient(135deg, color-mix(in srgb, " + theme.primary + " 14%, white) 0%, color-mix(in srgb, " + theme.accent + " 12%, white) 52%, color-mix(in srgb, " + theme.secondary + " 10%, white) 100%)";
    }

    function getGradientDark(theme) {
      return "linear-gradient(180deg, " + theme.secondary + " 0%, " + theme.primary + " 55%, " + theme.accent + " 100%)";
    }

    function getComponentColor(target) {
      var paletteKey = theme.componentColors[target];
      return theme[paletteKey];
    }

    var primaryForeground = getReadableTextColor(theme.primary);
    var secondaryForeground = getReadableTextColor(theme.secondary);
    var accentForeground = getReadableTextColor(theme.accent);
    var mutedForeground = getReadableTextColor(theme.muted);
    var successForeground = getReadableTextColor(theme.success);
    var gradientForeground = getReadableTextColor(theme.primary);
    var sidebarForeground = getReadableTextColor(theme.secondary);

    var headerBg = getComponentColor("header.background");
    var headerText = getReadableTextColor(headerBg);
    var headerActiveNav = getComponentColor("header.activeNav");
    var headerCtaBg = getComponentColor("header.ctaBackground");
    var headerPanelBg = getComponentColor("header.panelBackground");
    var sectionAccent = getComponentColor("sections.cardAccent");
    var cardBg = getComponentColor("sections.cardBackground");
    var cardText = getReadableTextColor(cardBg);
    var ctaBg = getComponentColor("cta.background");
    var footerBg = getComponentColor("footer.background");
    var buttonBg = getComponentColor("buttons.background");
    var buttonText = getReadableTextColor(buttonBg);

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
    root.style.setProperty("--primary-foreground", hexToHslValue(primaryForeground));
    root.style.setProperty("--ring", hexToHslValue(theme.primary));

    root.style.setProperty("--secondary", hexToHslValue(theme.secondary));
    root.style.setProperty("--secondary-foreground", hexToHslValue(secondaryForeground));

    root.style.setProperty("--accent", hexToHslValue(theme.muted));
    root.style.setProperty("--accent-foreground", hexToHslValue(mutedForeground));

    root.style.setProperty("--hero-bg", hexToHslValue(ctaBg));
    root.style.setProperty("--hero-foreground", hexToHslValue(getReadableTextColor(ctaBg)));
    root.style.setProperty("--hero-muted-foreground", hexToHslValue(getReadableTextColor(ctaBg)));

    root.style.setProperty("--site-header-bg", headerBg);
    root.style.setProperty("--site-header-text", headerText);
    root.style.setProperty("--site-header-active-nav", headerActiveNav);
    root.style.setProperty("--site-header-cta-bg", headerCtaBg);
    root.style.setProperty("--site-header-cta-text", getReadableTextColor(headerCtaBg));
    root.style.setProperty("--site-header-panel-bg", headerPanelBg);

    root.style.setProperty("--site-section-accent", sectionAccent);
    root.style.setProperty("--site-section-accent-text", getReadableTextColor(sectionAccent));

    root.style.setProperty("--site-card-bg", cardBg);
    root.style.setProperty("--site-card-text", cardText);
    root.style.setProperty("--site-card-border", "color-mix(in srgb, " + sectionAccent + " 30%, transparent)");

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
      "color-mix(in srgb, " + buttonBg + " 88%, black)"
    );
    root.style.setProperty(
      "--site-button-border",
      "color-mix(in srgb, " + buttonBg + " 76%, black)"
    );
  } catch (error) {}
})();
`;

  useServerInsertedHTML(() => {
    return (
      <script
        id="admin-theme-init"
        dangerouslySetInnerHTML={{ __html: script }}
      />
    );
  });

  return null;
}