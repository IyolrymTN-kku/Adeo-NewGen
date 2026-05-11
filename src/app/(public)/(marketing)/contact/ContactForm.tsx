"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { submitContactAction } from "./actions";
import { initialContactState, type ContactState } from "./types";
import { cn } from "@/lib/utils";


const baseInput =
  "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const inputOk =
  "border-slate-300 focus:border-[#0066ff] focus:ring-[#0066ff]/20";

const inputError =
  "border-red-300 focus:border-red-500 focus:ring-red-500/20";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(
    submitContactAction,
    initialContactState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const fieldClass = (field: keyof NonNullable<ContactState["fieldErrors"]>) =>
    cn(baseInput, state.fieldErrors?.[field] ? inputError : inputOk);

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="space-y-5"
      aria-busy={isPending}
    >
      {state.status === "success" && state.message && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{state.message}</span>
        </div>
      )}

      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <span>{state.message}</span>
        </div>
      )}

      {/* Honeypot — hidden from real users via tabindex/aria/styles */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Jane Doe"
          disabled={isPending}
          error={state.fieldErrors?.name?.[0]}
          className={fieldClass("name")}
        />
        <Field
          label="Work email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jane@company.com"
          disabled={isPending}
          error={state.fieldErrors?.email?.[0]}
          className={fieldClass("email")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Acme Corp."
          disabled={isPending}
          error={state.fieldErrors?.company?.[0]}
          className={fieldClass("company")}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+66 81 234 5678"
          disabled={isPending}
          error={state.fieldErrors?.phone?.[0]}
          className={fieldClass("phone")}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          How can we help? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={5000}
          disabled={isPending}
          aria-invalid={!!state.fieldErrors?.message}
          aria-describedby={
            state.fieldErrors?.message ? "message-error" : undefined
          }
          placeholder="Tell us a bit about your project, timeline, or the challenge you're trying to solve."
          className={cn(fieldClass("message"), "resize-y")}
        />
        {state.fieldErrors?.message?.[0] && (
          <p id="message-error" className="mt-1.5 text-xs text-red-600">
            {state.fieldErrors.message[0]}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      <p className="text-xs text-slate-500">
        By submitting this form you agree that ADEO Solution may contact you
        regarding your enquiry.
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type: "text" | "email" | "tel";
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className: string;
};

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
  placeholder,
  disabled,
  error,
  className,
}: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={className}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
