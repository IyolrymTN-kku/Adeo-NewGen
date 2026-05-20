"use client";

import { useEffect } from "react";

const STORAGE_KEY = "adeo-admin-theme";
const CHANNEL_NAME = "adeo-admin-theme-sync";

function isAdminPage() {
  return window.location.pathname.startsWith("/admin");
}

export function AdminThemeSync() {
  useEffect(() => {
    let refreshTimer: number | null = null;

    function refreshPublicPage() {
      // ไม่ refresh หน้า admin
      if (isAdminPage()) return;

      // กัน reload ซ้ำ
      if (refreshTimer !== null) return;

      refreshTimer = window.setTimeout(() => {
        window.location.reload();
      }, 150);
    }

    const channel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel(CHANNEL_NAME)
        : null;

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === "ADEO_ADMIN_THEME_CHANGED") {
          refreshPublicPage();
        }
      };
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      refreshPublicPage();
    }

    function handleThemeChanged() {
      refreshPublicPage();
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("ADEO_ADMIN_THEME_CHANGED", handleThemeChanged);

    return () => {
      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
      }

      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("ADEO_ADMIN_THEME_CHANGED", handleThemeChanged);
      channel?.close();
    };
  }, []);

  return null;
}