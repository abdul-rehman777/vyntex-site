"use client";

import { useActionState } from "react";
import { Loader2, Check } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { updateProfile, type ProfileActionState } from "@/app/portal/actions";
import type { UserProfile } from "@/lib/auth";

const initialState: ProfileActionState = { ok: false };

export default function ProfileForm({ profile }: { profile: UserProfile }) {
  const { t } = useLang();
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  const p = t.portal.profile;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="pf-fullName"
          name="fullName"
          label={p.fullName}
          defaultValue={profile.full_name ?? ""}
          required
        />
        <Field
          id="pf-businessName"
          name="businessName"
          label={p.businessName}
          defaultValue={profile.business_name ?? ""}
        />
        <Field
          id="pf-phone"
          name="phone"
          label={p.phone}
          type="tel"
          defaultValue={profile.phone ?? ""}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pf-lang" className="text-sm text-vx-silver">
            {p.language}
          </label>
          <select
            id="pf-lang"
            name="preferredLanguage"
            defaultValue={profile.preferred_language ?? "en"}
            className="rounded-xl border border-[rgba(14,165,233,0.18)] bg-vx-bg px-3.5 py-2.5 text-sm text-vx-ink focus-visible:border-vx-blue"
          >
            <option value="en">{p.langEn}</option>
            <option value="es">{p.langEs}</option>
          </select>
        </div>
      </div>

      {state.ok ? (
        <p role="status" className="inline-flex items-center gap-2 text-sm text-vx-cyan">
          <Check size={15} aria-hidden />
          {p.saved}
        </p>
      ) : null}
      {!state.ok && state.error && state.error !== "session" ? (
        <p role="alert" className="text-sm text-red-400">
          {p.error}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-vx-blue to-vx-cyan px-5 py-2.5 text-sm font-semibold text-vx-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
          {pending ? p.saving : p.save}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  defaultValue,
  type = "text",
  required,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-vx-silver">
        {label} {required ? <span className="text-vx-blue">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="rounded-xl border border-[rgba(14,165,233,0.18)] bg-vx-bg px-3.5 py-2.5 text-sm text-vx-ink placeholder:text-vx-silver-dim focus-visible:border-vx-blue"
      />
    </div>
  );
}
