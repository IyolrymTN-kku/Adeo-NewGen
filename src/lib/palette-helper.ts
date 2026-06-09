import type { CSSProperties } from "react";

export const palette = {
  header: {
    bg: "var(--site-header-bg, var(--admin-secondary, #0A1628))",
    text: "var(--site-header-text, var(--admin-secondary-foreground, #FFFFFF))",
    activeNav: "var(--site-header-active-nav, var(--admin-accent, #3385FF))",
    ctaBg: "var(--site-header-cta-bg, var(--admin-primary, #0066FF))",
    ctaText:
      "var(--site-header-cta-text, var(--admin-primary-foreground, #FFFFFF))",
    panelBg: "var(--site-header-panel-bg, var(--admin-secondary, #0A1628))",
  },

  section: {
    accent: "var(--site-section-accent, var(--admin-primary, #0066FF))",
    accentText:
      "var(--site-section-accent-text, var(--admin-primary-foreground, #FFFFFF))",
  },

  cta: {
    bg: "var(--site-cta-bg, var(--admin-secondary, #0A1628))",
    text: "var(--site-cta-text, var(--admin-secondary-foreground, #FFFFFF))",
  },

  footer: {
    bg: "var(--site-footer-bg, var(--admin-secondary, #0A1628))",
    text: "var(--site-footer-text, var(--admin-secondary-foreground, #FFFFFF))",
  },

  admin: {
    primary: "var(--admin-primary, #0066FF)",
    primaryText: "var(--admin-primary-foreground, #FFFFFF)",
    secondary: "var(--admin-secondary, #0A1628)",
    secondaryText: "var(--admin-secondary-foreground, #FFFFFF)",
    accent: "var(--admin-accent, #3385FF)",
    accentText: "var(--admin-accent-foreground, #FFFFFF)",
    muted: "var(--admin-muted, #FFFFFF)",
    mutedText: "var(--admin-muted-foreground, #0F172A)",
    success: "var(--admin-success, #22C55E)",
    successText: "var(--admin-success-foreground, #FFFFFF)",
  },
} as const;

export function mix(
  color: string,
  amount: number,
  withColor: string = "transparent"
) {
  return `color-mix(in srgb, ${color} ${amount}%, ${withColor})`;
}

export function headerStyle(scrolled: boolean): CSSProperties {
  return {
    backgroundColor: scrolled ? mix(palette.header.bg, 92) : palette.header.bg,
    color: palette.header.text,
    borderColor: mix(palette.header.activeNav, 28),
  };
}

export function headerNavLinkStyle(active: boolean): CSSProperties {
  return {
    color: active ? palette.header.activeNav : mix(palette.header.text, 78),
  };
}

export function headerMobileNavLinkStyle(active: boolean): CSSProperties {
  return {
    color: active ? palette.header.activeNav : mix(palette.header.text, 78),
    backgroundColor: active ? mix(palette.header.activeNav, 14) : "transparent",
  };
}

export function headerCtaStyle(): CSSProperties {
  return {
    backgroundColor: palette.header.ctaBg,
    color: palette.header.ctaText,
  };
}

export function ctaSectionStyle(): CSSProperties {
  return {
    backgroundColor: palette.cta.bg,
    color: palette.cta.text,
  };
}

export function footerStyle(): CSSProperties {
  return {
    backgroundColor: palette.footer.bg,
    color: mix(palette.footer.text, 74),
  };
}

export function sectionAccentStyle(): CSSProperties {
  return {
    backgroundColor: mix(palette.section.accent, 14),
    color: palette.section.accent,
  };
}

export function sectionAccentSolidStyle(): CSSProperties {
  return {
    backgroundColor: palette.section.accent,
    color: palette.section.accentText,
  };
}