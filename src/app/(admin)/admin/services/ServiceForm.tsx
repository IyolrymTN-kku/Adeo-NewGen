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
import { initialServiceState, type ServiceFormState } from "./form-state";
import { categoryLabel } from "@/lib/services";
import { SERVICE_CATEGORIES } from "@/lib/validations/service";

export type ServiceFormDefaults = {
  id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  category?: (typeof SERVICE_CATEGORIES)[number];
  features?: string[];
  isActive?: boolean;
  sortOrder?: number;
  icon?: string | null;
};

type ServiceFormProps = {
  defaults?: ServiceFormDefaults;
  action: (
    state: ServiceFormState,
    formData: FormData
  ) => Promise<ServiceFormState>;
  submitLabel: string;
  pendingLabel?: string;
};

export function ServiceForm({
  defaults,
  action,
  submitLabel,
  pendingLabel,
}: ServiceFormProps) {
  const [state, formAction] = useActionState(action, initialServiceState);
  const fieldErr = (k: keyof NonNullable<ServiceFormState["fieldErrors"]>) =>
    state.fieldErrors?.[k]?.[0];

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-6"
    >
      <FormFeedback status={state.status} message={state.message} />

      <FormSection
        title="Basics"
        description="The headline content displayed to visitors."
      >
        <div>
          <FieldLabel htmlFor="title" required>
            Title
          </FieldLabel>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={120}
            defaultValue={defaults?.title}
            aria-invalid={!!fieldErr("title")}
            className={inputClass(!!fieldErr("title"))}
          />
          <FieldError id="title-error" error={fieldErr("title")} />
        </div>

        <div>
          <FieldLabel
            htmlFor="slug"
            description="URL-friendly identifier (lowercase, hyphens). Auto-generated from title if blank."
          >
            Slug
          </FieldLabel>
          <input
            id="slug"
            name="slug"
            type="text"
            maxLength={80}
            defaultValue={defaults?.slug}
            placeholder="cloud-migration"
            className={inputClass(!!fieldErr("slug"), "font-mono")}
          />
          <FieldError id="slug-error" error={fieldErr("slug")} />
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
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
          <FieldError id="category-error" error={fieldErr("category")} />
        </div>
      </FormSection>

      <FormSection
        title="Copy"
        description="Short description appears in cards. Description appears on detail pages."
      >
        <div>
          <FieldLabel htmlFor="shortDescription" required>
            Short description
          </FieldLabel>
          <textarea
            id="shortDescription"
            name="shortDescription"
            required
            rows={2}
            minLength={10}
            maxLength={240}
            defaultValue={defaults?.shortDescription}
            className={inputClass(!!fieldErr("shortDescription"), "resize-y")}
          />
          <FieldError
            id="shortDescription-error"
            error={fieldErr("shortDescription")}
          />
        </div>

        <div>
          <FieldLabel htmlFor="description" required>
            Full description
          </FieldLabel>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            minLength={20}
            maxLength={5000}
            defaultValue={defaults?.description}
            className={inputClass(!!fieldErr("description"), "resize-y")}
          />
          <FieldError id="description-error" error={fieldErr("description")} />
        </div>

        <div>
          <FieldLabel
            htmlFor="features"
            description="One feature per line. Maximum 20 entries."
          >
            Key features
          </FieldLabel>
          <textarea
            id="features"
            name="features"
            rows={6}
            defaultValue={defaults?.features?.join("\n") ?? ""}
            placeholder={
              "24/7 helpdesk\nProactive monitoring\nMonthly health reports"
            }
            className={inputClass(!!fieldErr("features"), "resize-y font-mono text-xs")}
          />
          <FieldError id="features-error" error={fieldErr("features")} />
        </div>
      </FormSection>

      <FormSection
        title="Icon (optional)"
        description="Square SVG/PNG up to 5 MB. Replaces existing icon when set."
      >
        {defaults?.icon && (
          <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <Image
              src={defaults.icon}
              alt="Current icon"
              width={48}
              height={48}
              className="h-12 w-12 rounded-md bg-white object-contain p-1"
            />
            <div className="flex-1 text-xs text-slate-600">
              <p className="font-mono">{defaults.icon}</p>
              <label className="mt-2 inline-flex items-center gap-2 text-slate-700">
                <input type="checkbox" name="removeIcon" />
                <span>Remove current icon</span>
              </label>
            </div>
          </div>
        )}
        <div>
          <FieldLabel htmlFor="icon">
            {defaults?.icon ? "Replace icon" : "Upload icon"}
          </FieldLabel>
          <input
            id="icon"
            name="icon"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />
          <FieldError id="icon-error" error={fieldErr("icon")} />
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
        <ButtonLink href="/admin/services" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
