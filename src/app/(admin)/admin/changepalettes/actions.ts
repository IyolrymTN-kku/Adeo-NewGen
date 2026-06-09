export type AdminTheme = {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  success: string;
};

export const STORAGE_KEY = "adeo-admin-theme";

export const defaultTheme: AdminTheme = {
  primary: "#0066FF",
  secondary: "#0A1628",
  accent: "#3385FF",
  muted: "#FFFFFF",
  success: "#22C55E",
};

export function isValidHex(hex: unknown): hex is string {
  return typeof hex === "string" && /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export function isValidAdminTheme(value: unknown): value is AdminTheme {
  if (!value || typeof value !== "object") return false;

  const theme = value as Partial<AdminTheme>;

  return (
    isValidHex(theme.primary) &&
    isValidHex(theme.secondary) &&
    isValidHex(theme.accent) &&
    isValidHex(theme.muted) &&
    isValidHex(theme.success)
  );
}