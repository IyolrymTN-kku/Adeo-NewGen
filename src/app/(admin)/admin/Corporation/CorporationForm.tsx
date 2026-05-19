"use client";

import { useState } from "react";
import Image from "next/image";
import { updateCorporation } from "./actions";
import type { companySettings } from "@prisma/client";
import { isValidPhoneNumber } from "react-phone-number-input";
import dynamic from "next/dynamic";

const PhoneInput = dynamic(
  () => import("react-phone-number-input"),
  { ssr: false }
);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0066ff] focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20";

function validateImageSize(file: File, width: number, height: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      resolve(img.width === width && img.height === height);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}

function validateUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function CorporationForm({ settings }: { settings: companySettings | null }) {
  const [taxIdError, setTaxIdError]   = useState<string | null>(null);
  const [phoneError, setPhoneError]   = useState<string | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  const [loading, setLoading]               = useState(false);
  const [message, setMessage]               = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [logoPreview, setLogoPreview]       = useState<string | null>(settings?.logoUrl    ?? null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(settings?.faviconUrl ?? null);
  const [logoError, setLogoError]           = useState<string | null>(null);
  const [faviconError, setFaviconError]     = useState<string | null>(null);
  const [socialErrors, setSocialErrors]     = useState<Record<string, string>>({});
  const [phone, setPhone] = useState(settings?.phone ?? "");

    function validateTaxId(value: string) {
    if (!value) { setTaxIdError(null); return; }
    if (!/^\d+$/.test(value)) {
      setTaxIdError("Please enter numbers only");
    } else if (value.length !== 13) {
      setTaxIdError(null);
    } else {
      setTaxIdError(null);
    }
  }

  function validatePhone(value: string) {
  if (!value) {
    setPhoneError("Please enter a phone number");
    return;
  }

  if (!isValidPhoneNumber(value)) {
    setPhoneError("Please enter a valid phone number");
    return;
  }

  setPhoneError(null);
}

  function validateWebsite(value: string) {
    if (!value) { setWebsiteError(null); return; }
    if (!validateUrl(value)) {
      setWebsiteError("Invalid URL. Please enter a valid https://... URL");
    } else {
      setWebsiteError(null);
    }
  }

  function handleUrlChange(field: string, value: string) {
    if (!validateUrl(value)) {
      setSocialErrors(prev => ({ ...prev, [field]: "Invalid URL. Please enter a valid https://... URL" }));
    } else {
      setSocialErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (Object.keys(socialErrors).length > 0) return;
    setLoading(true);
    setMessage(null);
    const result = await updateCorporation(new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Information saved successfully" });
      setTimeout(() => window.location.reload(), 1000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <Section title="Company information">
        <Field label="Company Name"> 
          <input name="companyName" defaultValue={settings?.companyName ?? "ADEO Solution"} className={inputCls} required />
        </Field>
        <Field label="Company Description (EN)" hint="Maximum 200 characters">
          <textarea name="descriptionEn" defaultValue={settings?.descriptionEn ?? ""} className={inputCls} rows={3} placeholder="Enterprise IT Solutions and Cloud Services..." maxLength={500} />
        </Field>
        <Field label="Company Description (TH)" hint="Maximum 200 characters">
          <textarea name="descriptionTh" defaultValue={settings?.descriptionTh ?? ""} className={inputCls} rows={3} placeholder="โซลูชันด้านไอทีสำหรับองค์กร..." maxLength={500} />
        </Field>
        <Field label="Tax ID">
          <input
            name="taxId"
            defaultValue={settings?.taxId ?? ""}
            className={`${inputCls} ${taxIdError ? "border-red-400" : ""}`}
            placeholder="0000000000000"
            maxLength={13}
            onChange={e => validateTaxId(e.target.value)}
          />
          {taxIdError && <p className="text-xs font-medium text-red-600">{taxIdError}</p>}
        </Field>
        <Field label="Email">
          <input name="email" type="email" defaultValue={settings?.email ?? ""} className={inputCls} placeholder="contact@example.com" />
        </Field>
        <Field label="Phone Number">
           <PhoneInput
              international
              defaultCountry="TH"
              value={phone}
              onChange={(value) => {
                const phoneValue = value || "";
                setPhone(phoneValue);
                validatePhone(phoneValue);
              }}
              className={`${inputCls} ${phoneError ? "border-red-400" : ""}`}
              placeholder="Enter phone number"
            />

            <input type="hidden" name="phone" value={phone} />

            {phoneError && (
              <p className="text-xs font-medium text-red-600">
                {phoneError}
              </p>
            )}
          </Field>
        <Field label="Address">
          <input name="address" defaultValue={settings?.address ?? ""} className={inputCls} placeholder="Bangkok, Thailand" />
        </Field>
        <Field label="Website">
          <input
            name="website"
            defaultValue={settings?.website ?? ""}
            className={`${inputCls} ${websiteError ? "border-red-400" : ""}`}
            placeholder="https://example.com"
            onChange={e => validateWebsite(e.target.value)}
          />
          {websiteError && <p className="text-xs font-medium text-red-600">{websiteError}</p>}
        </Field>
      </Section>

      <Section title="Logo & Favicon">
        <Field label="Logo" hint="PNG only, 32×32px recommended">
          {logoPreview && (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
              <Image src={logoPreview} alt="logo preview" fill className="object-contain" />
            </div>
          )}
          <input name="logo" type="file" accept="image/png"
            onChange={async e => {
              const f = e.target.files?.[0];
              if (!f) return;
              setLogoError(null);
              if (f.type !== "image/png") { setLogoError("Please upload a PNG file only"); e.target.value = ""; return; }
              const valid = await validateImageSize(f, 32, 32);
              if (!valid) { setLogoError("Image size must be 32×32px"); e.target.value = ""; return; }
              setLogoPreview(URL.createObjectURL(f));
            }}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0066ff] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#0052cc]"
          />
          {logoError && <p className="text-xs font-medium text-red-600">{logoError}</p>}
        </Field>
        <Field label="Favicon" hint="PNG only, 32×32px recommended">
          {faviconPreview && (
            <div className="relative h-10 w-10 overflow-hidden rounded border border-slate-200 bg-slate-50 p-1">
              <Image src={faviconPreview} alt="favicon preview" fill className="object-contain" />
            </div>
          )}
          <input name="favicon" type="file" accept="image/png"
            onChange={async e => {
              const f = e.target.files?.[0];
              if (!f) return;
              setFaviconError(null);
              if (f.type !== "image/png") { setFaviconError("Please upload a PNG file only"); e.target.value = ""; return; }
              const valid = await validateImageSize(f, 32, 32);
              if (!valid) { setFaviconError("Image size must be 32×32px"); e.target.value = ""; return; }
              setFaviconPreview(URL.createObjectURL(f));
            }}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0066ff] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#0052cc]"
          />
          {faviconError && <p className="text-xs font-medium text-red-600">{faviconError}</p>}
        </Field>
      </Section>

      <Section title="Social Media">
        {["facebook", "linkedin", "instagram", "tiktok"].map((field) => (
          <Field key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
            <input
              name={field}
              defaultValue={(settings as unknown as Record<string, string | null>)?.[field] ?? ""}
              className={`${inputCls} ${socialErrors[field] ? "border-red-400" : ""}`}
              placeholder={`https://${field}.com/yourhandle`}
              onChange={e => handleUrlChange(field, e.target.value)}
            />
            {socialErrors[field] && <p className="text-xs font-medium text-red-600">{socialErrors[field]}</p>}
          </Field>
        ))}
        <Field label="Line">
          <input name="line" defaultValue={settings?.line ?? ""} className={inputCls} placeholder="@yourlineid" />
        </Field>
      </Section>

      {message && (
        <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || Object.keys(socialErrors).length > 0 || !!taxIdError || !!phoneError || !!websiteError}
        className="rounded-lg bg-[#0066ff] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0052cc] disabled:opacity-60">
        {loading ? "Saving...." : "save"}
      </button>
    </form>
  );
}