import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'none'",
  "connect-src 'self'",

  // อนุญาตให้หน้า admin iframe ไฟล์ HTML จาก origin เดียวกันได้
  "frame-src 'self'",

  // อนุญาตให้หน้าของเว็บเราเองถูกฝังใน iframe จากเว็บเดียวกันได้
  "frame-ancestors 'self'",

  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },

  // เปลี่ยนจาก DENY เป็น SAMEORIGIN เพื่อให้ iframe ภายในเว็บเดียวกันทำงาน
  { key: "X-Frame-Options", value: "SAMEORIGIN" },

  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
<<<<<<< HEAD

=======
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
  eslint: { ignoreDuringBuilds: true },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [],
  },
};

<<<<<<< HEAD
export default nextConfig;
=======
export default withNextIntl(nextConfig);
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
