"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";


type Props = {
  initialData: {
    companyName: string;
    description: string;
    ogImage?: string | null;
    website?: string | null;
  };
};

type PreviewTab = "google" | "facebook" | "twitter";

export function SeoMediaForm({ initialData }: Props) {
  const [activeTab, setActiveTab] =
    useState<PreviewTab>("google");

  const [title, setTitle] = useState(
    initialData.companyName
  );

  const [description, setDescription] = useState(
    initialData.description
  );

  const [ogImage, setOgImage] = useState(
    initialData.ogImage || ""
  );

  const domain =
    initialData.website?.replace(/^https?:\/\//, "") ||
    "your-company.com";

  return (
    <div className="space-y-8 pb-12">

      {/* GRID */}
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">

        {/* LEFT */}
        <div className="space-y-8">

          {/* SEARCH */}
          <Card
            className="rounded-3xl p-8 shadow-sm"
            style={{
              backgroundColor: "var(--admin-secondary, #0a1628)",
              borderColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 25%, transparent)",
              color: "var(--admin-secondary-foreground, #ffffff)",
              ["--site-card-text" as any]: "var(--admin-secondary-foreground, #ffffff)",
            }}
          >
            <div className="mb-8">
              <h2 className="text-xl font-semibold" style={{ color: "var(--site-card-text, currentColor)" }}>
                Search Appearance
              </h2>

              <p className="mt-1 text-sm opacity-70" style={{ color: "var(--site-card-text, currentColor)" }}>
                Control how your website appears on Google
                and social media.
              </p>
            </div>

            <div className="space-y-6">

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-medium opacity-85" style={{ color: "var(--site-card-text, currentColor)" }}>
                  SEO Title
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-[#0066ff]
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="opacity-60" style={{ color: "var(--site-card-text, currentColor)" }}>
                    Recommended: 50–60 characters
                  </span>

                  <span
                    className={cn(
                      "font-medium",
                      title.length > 60
                        ? "text-red-500"
                        : "opacity-60"
                    )}
                    style={title.length > 60 ? {} : { color: "var(--site-card-text, currentColor)" }}
                  >
                    {title.length}/60
                  </span>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-medium opacity-85" style={{ color: "var(--site-card-text, currentColor)" }}>
                  Meta Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="
                    min-h-[140px]
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-[#0066ff]
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="opacity-60" style={{ color: "var(--site-card-text, currentColor)" }}>
                    Recommended: 140–160 characters
                  </span>

                  <span
                    className={cn(
                      "font-medium",
                      description.length > 160
                        ? "text-red-500"
                        : "opacity-60"
                    )}
                    style={description.length > 160 ? {} : { color: "var(--site-card-text, currentColor)" }}
                  >
                    {description.length}/160
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* OG IMAGE */}
          <Card
            className="rounded-3xl p-8 shadow-sm"
            style={{
              backgroundColor: "var(--admin-secondary, #0a1628)",
              borderColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 25%, transparent)",
              color: "var(--admin-secondary-foreground, #ffffff)",
              ["--site-card-text" as any]: "var(--admin-secondary-foreground, #ffffff)",
            }}
          >
            <div className="mb-8">
              <h2 className="text-xl font-semibold" style={{ color: "var(--site-card-text, currentColor)" }}>
                Open Graph Image
              </h2>

              <p className="mt-1 text-sm opacity-70" style={{ color: "var(--site-card-text, currentColor)" }}>
                Used for Facebook, Twitter/X, LinkedIn,
                Discord and messaging previews.
              </p>
            </div>

            <label
              className="
                group
                flex
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                border-slate-300
                bg-slate-50
                px-6
                py-14
                text-center
                transition
                hover:border-[#0066ff]
                hover:bg-blue-50/40
              "
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  const preview =
                    URL.createObjectURL(file);

                  setOgImage(preview);
                }}
              />

              <div
                className="
                  mb-5
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  shadow-sm
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-6 w-6 text-[#0066ff]"
                >
                  <path d="M12 16V4" />
                  <path d="M7 9l5-5 5 5" />
                  <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 16.25" />
                  <path d="M8 16h8" />
                </svg>
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                Upload Social Preview Image
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                PNG or JPG · Recommended 1200×630 px
              </p>
            </label>

            {ogImage && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={ogImage}
                  alt=""
                  className="h-[260px] w-full object-cover"
                />
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* PREVIEW HEADER */}
          <Card
            className="rounded-3xl p-5 shadow-sm"
            style={{
              backgroundColor: "var(--admin-secondary, #0a1628)",
              borderColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 25%, transparent)",
              color: "var(--admin-secondary-foreground, #ffffff)",
              ["--site-card-text" as any]: "var(--admin-secondary-foreground, #ffffff)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold" style={{ color: "var(--site-card-text, currentColor)" }}>
                  Live Preview
                </h3>

                <p className="mt-1 text-xs opacity-70" style={{ color: "var(--site-card-text, currentColor)" }}>
                  See how your content appears online
                </p>
              </div>

              <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                LIVE
              </div>
            </div>

            {/* TABS */}
            <div className="mt-5 flex gap-2 rounded-xl bg-slate-100 p-1">
              {[
                "google",
                "facebook",
                "twitter",
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab as PreviewTab)
                  }
                  className={cn(
                    "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition",
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {tab === "facebook"
                    ? "Facebook"
                    : tab === "twitter"
                    ? "Twitter/X"
                    : "Google"}
                </button>
              ))}
            </div>
          </Card>

          {/* GOOGLE */}
          {activeTab === "google" && (
            <Card
              className="rounded-3xl p-7 shadow-sm"
              style={{
                backgroundColor: "var(--admin-secondary, #0a1628)",
                borderColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 25%, transparent)",
                color: "var(--admin-secondary-foreground, #ffffff)",
                ["--site-card-text" as any]: "var(--admin-secondary-foreground, #ffffff)",
              }}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="space-y-1">
                  <div className="text-sm text-green-700">
                    https://{domain}
                  </div>

                  <div className="text-[22px] leading-snug text-[#1a0dab]">
                    {title || "Your Company"}
                  </div>

                  <div className="text-sm leading-relaxed text-slate-600">
                    {description ||
                      "Enterprise IT & cloud services."}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* FACEBOOK */}
          {activeTab === "facebook" && (
            <Card
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: "var(--admin-secondary, #0a1628)",
                borderColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 25%, transparent)",
                color: "var(--admin-secondary-foreground, #ffffff)",
                ["--site-card-text" as any]: "var(--admin-secondary-foreground, #ffffff)",
              }}
            >
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[1.91/1] bg-slate-100">
                  {ogImage ? (
                    <img
                      src={ogImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image selected
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    {domain}
                  </div>

                  <div className="mt-2 line-clamp-2 text-base font-semibold text-slate-900">
                    {title}
                  </div>

                  <div className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* TWITTER */}
          {activeTab === "twitter" && (
            <Card
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: "var(--admin-secondary, #0a1628)",
                borderColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 25%, transparent)",
                color: "var(--admin-secondary-foreground, #ffffff)",
                ["--site-card-text" as any]: "var(--admin-secondary-foreground, #ffffff)",
              }}
            >
              <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
                <div className="aspect-[1.91/1] bg-slate-100">
                  {ogImage ? (
                    <img
                      src={ogImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image selected
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {title}
                  </div>

                  <div className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    {domain}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* TIPS */}
          <Card
            className="rounded-3xl p-6 shadow-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 12%, var(--admin-secondary, #0a1628))",
              borderColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 25%, transparent)",
              color: "var(--admin-secondary-foreground, #ffffff)",
              ["--site-card-text" as any]: "var(--admin-secondary-foreground, #ffffff)",
            }}
          >
            <h3 className="font-semibold" style={{ color: "var(--site-card-text, currentColor)" }}>
              Optimization Tips
            </h3>

            <ul className="mt-4 space-y-3 text-sm leading-relaxed opacity-80" style={{ color: "var(--site-card-text, currentColor)" }}>
              <li>
                • Use a clean, high contrast image
              </li>

              <li>
                • Keep titles concise and readable
              </li>

              <li>
                • Recommended image size:
                1200×630 px
              </li>

              <li>
                • Avoid too much text inside images
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}