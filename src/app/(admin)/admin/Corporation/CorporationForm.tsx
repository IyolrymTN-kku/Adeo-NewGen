"use client";

import { useState } from "react";
import Image from "next/image";
import { updateCorporation } from "./actions";
import type { companySettings } from "@prisma/client";

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

export function CorporationForm({ settings }: { settings: companySettings | null }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [logoPreview, setLogoPreview]       = useState<string | null>(settings?.logoUrl    ?? null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(settings?.faviconUrl ?? null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        <Field label="ชื่อบริษัท *">
          <input name="companyName" defaultValue={settings?.companyName ?? "ADEO Solution"} className={inputCls} required />
        </Field>
        <Field label="คำอธิบายบริษัท" hint="แนะนำไม่เกิน 200 ตัวอักษร">
          <textarea
            name="description"
            defaultValue={settings?.description ?? ""}
            className={inputCls}
            rows={3}
            placeholder="Enterprise IT Solutions and Cloud Services..."
            maxLength={500}
          />
        </Field>
        <Field label="เลขที่ผู้เสียภาษี">
          <input name="taxId" defaultValue={settings?.taxId ?? ""} className={inputCls} placeholder="0000000000000" maxLength={20} />
        </Field>
        <Field label="อีเมล">
          <input name="email" type="email" defaultValue={settings?.email ?? ""} className={inputCls} placeholder="contact@example.com" />
        </Field>
        <Field label="เบอร์โทรศัพท์">
          <input name="phone" defaultValue={settings?.phone ?? ""} className={inputCls} placeholder="+66 (0) 2 000 0000" />
        </Field>
        <Field label="ที่อยู่">
          <input name="address" defaultValue={settings?.address ?? ""} className={inputCls} placeholder="Bangkok, Thailand" />
        </Field>
        <Field label="เว็บไซต์">
          <input name="website" defaultValue={settings?.website ?? ""} className={inputCls} placeholder="https://example.com" />
        </Field>
      </Section>

      <Section title="Logo & Favicon">
        <Field label="โลโก้บริษัท" hint="แนะนำ PNG/SVG แนวนอน ขนาด 200×60px">
          {logoPreview && (
            <div className="relative h-16 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
              <Image src={logoPreview} alt="logo preview" fill className="object-contain" />
            </div>
          )}
          <input name="logo" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={e => { const f = e.target.files?.[0]; if (f) setLogoPreview(URL.createObjectURL(f)); }}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0066ff] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#0052cc]"
          />
        </Field>
        <Field label="Favicon" hint="แนะนำ SVG หรือ PNG ขนาด 32×32px">
          {faviconPreview && (
            <div className="relative h-10 w-10 overflow-hidden rounded border border-slate-200 bg-slate-50 p-1">
              <Image src={faviconPreview} alt="favicon preview" fill className="object-contain" />
            </div>
          )}
          <input name="favicon" type="file" accept="image/png,image/svg+xml,image/x-icon"
            onChange={e => { const f = e.target.files?.[0]; if (f) setFaviconPreview(URL.createObjectURL(f)); }}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0066ff] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#0052cc]"
          />
        </Field>
      </Section>

      <Section title="Social Media">
        <Field label="Facebook">
          <input name="facebook" defaultValue={settings?.facebook ?? ""} className={inputCls} placeholder="https://facebook.com/yourpage" />
        </Field>
        <Field label="LinkedIn">
          <input name="linkedin" defaultValue={settings?.linkedin ?? ""} className={inputCls} placeholder="https://linkedin.com/company/yourcompany" />
        </Field>
        <Field label="Instagram">
          <input name="instagram" defaultValue={settings?.instagram ?? ""} className={inputCls} placeholder="https://instagram.com/yourhandle" />
        </Field>
        <Field label="TikTok">
          <input name="tiktok" defaultValue={settings?.tiktok ?? ""} className={inputCls} placeholder="https://tiktok.com/@yourhandle" />
        </Field>
        <Field label="Line">
          <input name="line" defaultValue={settings?.line ?? ""} className={inputCls} placeholder="@yourlineid" />
        </Field>
      </Section>

      {message && (
        <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </p>
      )}

      <button type="submit" disabled={loading}
        className="rounded-lg bg-[#0066ff] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0052cc] disabled:opacity-60">
        {loading ? "Saving...." : "save"}
      </button>
    </form>
  );
}