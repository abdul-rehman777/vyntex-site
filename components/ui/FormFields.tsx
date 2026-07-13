"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

/**
 * Generic, accessible form field primitives shared across all forms.
 * Each takes a React Hook Form `field` (from register()) so `name`, `ref`, and
 * handlers are wired consistently. Errors are shown inline and associated via
 * aria-invalid; required fields are marked with more than color.
 */

const inputBase =
  "rounded-xl border border-[rgba(14,165,233,0.18)] bg-vx-bg px-3.5 py-2.5 text-sm text-vx-ink placeholder:text-vx-silver-dim focus-visible:border-vx-blue disabled:cursor-not-allowed disabled:opacity-60";

export function TextField({
  label,
  field,
  error,
  required,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  field: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.name} className="text-sm text-vx-silver">
        {label} {required ? <span className="text-vx-blue">*</span> : null}
      </label>
      <input
        id={field.name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={inputBase}
        {...field}
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

export function TextAreaField({
  label,
  field,
  error,
  required,
  rows = 4,
  placeholder,
}: {
  label: string;
  field: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.name} className="text-sm text-vx-silver">
        {label} {required ? <span className="text-vx-blue">*</span> : null}
      </label>
      <textarea
        id={field.name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={inputBase}
        {...field}
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

export function SelectField({
  label,
  field,
  options,
  placeholder,
  error,
  required,
}: {
  label: string;
  field: UseFormRegisterReturn;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.name} className="text-sm text-vx-silver">
        {label} {required ? <span className="text-vx-blue">*</span> : null}
      </label>
      <select
        id={field.name}
        defaultValue=""
        aria-invalid={Boolean(error)}
        className={inputBase}
        {...field}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

/**
 * Single consent/acknowledgement checkbox. The error is rendered as text (not
 * just a red border), so state is never communicated by color alone.
 */
export function CheckboxField({
  label,
  field,
  error,
}: {
  label: string;
  field: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-start gap-2.5 text-sm text-vx-muted">
        <input
          type="checkbox"
          className="mt-1 shrink-0 accent-vx-blue"
          aria-invalid={Boolean(error)}
          {...field}
        />
        <span>{label}</span>
      </label>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

/**
 * Multi-select rendered as a checkbox group inside a fieldset, so screen
 * readers announce the group label with each option.
 */
export function CheckboxGroupField({
  legend,
  field,
  options,
  error,
  required,
}: {
  legend: string;
  field: UseFormRegisterReturn;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm text-vx-silver">
        {legend} {required ? <span className="text-vx-blue">*</span> : null}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-[rgba(14,165,233,0.18)] bg-vx-bg px-3.5 py-2.5 text-sm text-vx-silver"
          >
            <input
              type="checkbox"
              value={o.value}
              className="shrink-0 accent-vx-blue"
              {...field}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </fieldset>
  );
}

/** Read-only key/value row used in summaries and status panels. */
export function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(14,165,233,0.10)] py-2 last:border-0">
      <span className="text-xs uppercase tracking-wide text-vx-muted">{label}</span>
      <span className="text-right text-sm font-medium text-vx-ink">{value}</span>
    </div>
  );
}
