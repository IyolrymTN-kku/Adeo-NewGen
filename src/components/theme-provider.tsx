"use client";

import { useEffect } from "react";
import { loadAdeoTheme } from "@/lib/theme";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    loadAdeoTheme();

    const syncTheme = () => {
      loadAdeoTheme();
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener("adeo-theme-updated", syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("adeo-theme-updated", syncTheme);
    };
  }, []);

  return <>{children}</>;
}