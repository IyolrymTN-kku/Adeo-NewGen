"use client";

import { useActionState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormFeedback } from "@/components/admin/FormFeedback";
import {
  FieldError,
  FieldLabel,
  FormSection,
  inputClass,
} from "@/components/admin/FormField";
import { initialPartnerState, type PartnerFormState } from "./form-state";
import { PARTNER_CATEGORIES } from "@/lib/validations/partner";

const CATEGORY_LABELS: Record<(typeof PARTNER_CATEGORIES)[number], string> = {
  NETWORK: "Network",
  CLOUD: "Cloud",
  SECURITY: "Security",
  HARDWARE: "Hardware",
};

export type PartnerFormDefaults = {
  name?: string;
  websiteUrl?: string | null;
  category?: (typeof PARTNER_CATEGORIES)[number];
  isActive?: boolean;
  sortOrder?: number;
  logoUrl?: string;
};

type PartnerFormProps = {
  defaults?: PartnerFormDefaults;
  action: (
    state: PartnerFormState,
    formData: FormData
  ) => Promise<PartnerFormState>;
  submitLabel: string;
  pendingLabel?: string;
  isCreate?: boolean;
};

export function PartnerForm({
  defaults,
  action,
  submitLabel,
  pendingLabel,
  isCreate = false,
}: PartnerFormProps) {
  const [state, formAction] = useActionState(action, initialPartnerState);
  const fieldErr = (k: keyof NonNullable<PartnerFormState["fieldErrors"]>) =>
    state.fieldErrors?.[k]?.[0];

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <FormFeedback status={state.status} message={state.message} />

      <FormSection title="Partner details">
        <div>
          <FieldLabel htmlFor="name" required>
            Name
          </FieldLabel>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            defaultValue={defaults?.name}
            className={inputClass(!!fieldErr("name"))}
          />
          <FieldError id="name-error" error={fieldErr("name")} />
        </div>

        <div>
          <FieldLabel htmlFor="category" required>
            Category
          </FieldLabel>
          <select
            id="category"
            name="category"
            required
            defaultValue={defaults?.category ?? ""}
            className={inputClass(!!fieldErr("category"))}
          >
            <option value="" disabled>
              Select a category…
            </option>
            {PARTNER_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
          <FieldError id="category-error" error={fieldErr("category")} />
        </div>

        <div>
          <FieldLabel
            htmlFor="websiteUrl"
            description="Optional. Used for the logo link on the public site."
          >
            Website URL
          </FieldLabel>
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            maxLength={500}
            placeholder="https://example.com"
            defaultValue={defaults?.websiteUrl ?? ""}
            className={inputClass(!!fieldErr("websiteUrl"))}
          />
          <FieldError id="websiteUrl-error" error={fieldErr("websiteUrl")} />
        </div>
      </FormSection>

      <FormSection
        title={isCreate ? "Logo" : "Replace logo"}
        description="PNG, JPG, WebP, or SVG. Up to 5 MB."
      >
        {defaults?.logoUrl && (
          <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            {defaults.logoUrl.startsWith("/uploads/") ? (
              <Image
                src={defaults.logoUrl}
                alt="Current logo"
                width={120}
                height={48}
                className="h-12 w-auto rounded-md bg-white object-contain p-1"
              />
            ) : (
              <span className="rounded-md bg-white px-3 py-2 text-xs font-mono text-slate-600">
                {defaults.logoUrl}
              </span>
            )}
            <div className="flex-1 text-xs">
              <p className="font-mono text-slate-600">{defaults.logoUrl}</p>
              <p className="mt-0.5 text-slate-500">
                Upload a new file below to replace.
              </p>
            </div>
          </div>
        )}
        <div>
          <FieldLabel htmlFor="logo" required={isCreate}>
            {isCreate ? "Logo image" : "New logo image"}
          </FieldLabel>
          <input
            id="logo"
            name="logo"
            type="file"
            required={isCreate}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />
          <FieldError id="logo-error" error={fieldErr("logo")} />
        </div>
      </FormSection>

      <FormSection title="Visibility">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="sortOrder" description="Lower numbers appear first.">
              Sort order
            </FieldLabel>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              max={9999}
              defaultValue={defaults?.sortOrder ?? 0}
              className={inputClass(!!fieldErr("sortOrder"))}
            />
            <FieldError id="sortOrder-error" error={fieldErr("sortOrder")} />
          </div>
          <div>
            <FieldLabel htmlFor="isActive">Status</FieldLabel>
            <label className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked={defaults?.isActive ?? true}
                className="h-4 w-4 rounded border-slate-300 text-[#0066ff] focus:ring-[#0066ff]/20"
              />
              <span className="text-sm text-slate-700">
                Active (visible on the public site)
              </span>
            </label>
          </div>
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel={pendingLabel}>{submitLabel}</SubmitButton>
        <ButtonLink href="/admin/partners" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
