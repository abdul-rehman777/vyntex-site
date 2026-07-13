"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import {
  makeResellerApplicationSchema,
  APPLICATION_MESSAGE_MIN,
  CLIENT_COUNTS,
  RESELLER_SERVICES,
  RESELL_MODELS,
  type ResellerApplicationInput,
} from "@/lib/validation/reseller";
import {
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
  CheckboxGroupField,
} from "@/components/ui/FormFields";
import GlowCard from "@/components/ui/GlowCard";

type Status = "idle" | "submitting" | "success" | "partial" | "error";

/**
 * Public reseller application. Collects intent only — no pricing is shown,
 * referenced, or unlocked here. Approval happens server-side, out of band.
 */
export default function ResellerApplicationForm() {
  const { t, lang } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef<number>(Date.now());

  const a = t.reseller.apply;

  const schema = makeResellerApplicationSchema({
    required: t.forms.errors.required,
    invalidEmail: t.forms.errors.invalidEmail,
    invalidPhone: t.forms.errors.invalidPhone,
    invalidWebsite: t.forms.errors.invalidEmail,
    invalidState: t.forms.errors.required,
    minMessage: t.forms.errors.minMessage.replace(
      "{min}",
      String(APPLICATION_MESSAGE_MIN),
    ),
    consent: t.forms.errors.consent,
    selectAtLeastOne: t.forms.errors.selectAtLeastOne,
    selectOne: t.forms.errors.selectService,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResellerApplicationInput>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: "", website: "", servicesInterest: [] },
  });

  const onSubmit = async (values: ResellerApplicationInput) => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/reseller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          language: lang,
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        partial?: boolean;
        code?: string;
      };

      if (data.ok) {
        setStatus(data.partial ? "partial" : "success");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setErrorMsg(
        data.code === "rate_limited"
          ? t.forms.errors.rateLimited
          : data.code === "spam"
            ? t.forms.errors.spam
            : t.forms.errors.server,
      );
      setStatus("error");
    } catch {
      setErrorMsg(t.forms.errors.network);
      setStatus("error");
    }
  };

  if (status === "success" || status === "partial") {
    return (
      <GlowCard className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-vx-cyan/30 bg-vx-bg3 text-vx-cyan">
          <Check size={26} aria-hidden />
        </span>
        <h2 className="text-xl font-bold text-vx-ink">{a.successTitle}</h2>
        <p role="status" className="max-w-md text-sm text-vx-muted">
          {a.successBody}
        </p>
      </GlowCard>
    );
  }

  const clientCountOptions = CLIENT_COUNTS.map((value) => ({
    value,
    label: a.clientCountOptions[value],
  }));

  const serviceOptions = RESELLER_SERVICES.map((value) => ({
    value,
    label: a.serviceOptions[value],
  }));

  const modelOptions = RESELL_MODELS.map((value) => ({
    value,
    label: a.modelOptions[value],
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {/* Honeypot — hidden from humans and assistive tech. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        {...register("honeypot")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label={a.fields.fullName}
          required
          autoComplete="name"
          field={register("fullName")}
          error={errors.fullName?.message}
        />
        <TextField
          label={a.fields.businessName}
          required
          autoComplete="organization"
          field={register("businessName")}
          error={errors.businessName?.message}
        />
        <TextField
          label={a.fields.email}
          required
          type="email"
          autoComplete="email"
          field={register("email")}
          error={errors.email?.message}
        />
        <TextField
          label={a.fields.phone}
          required
          type="tel"
          autoComplete="tel"
          field={register("phone")}
          error={errors.phone?.message}
        />
        <TextField
          label={`${a.fields.website} (${t.forms.optional})`}
          placeholder="https://"
          autoComplete="url"
          field={register("website")}
          error={errors.website?.message}
        />
        <div className="grid grid-cols-[1fr_88px] gap-3">
          <TextField
            label={a.fields.city}
            required
            autoComplete="address-level2"
            field={register("city")}
            error={errors.city?.message}
          />
          <TextField
            label={a.fields.state}
            required
            placeholder="NJ"
            autoComplete="address-level1"
            field={register("state")}
            error={errors.state?.message}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label={a.fields.clientCount}
          required
          placeholder={a.selectPlaceholder}
          options={clientCountOptions}
          field={register("clientCount")}
          error={errors.clientCount?.message}
        />
        <SelectField
          label={a.fields.resellModel}
          required
          placeholder={a.selectPlaceholder}
          options={modelOptions}
          field={register("resellModel")}
          error={errors.resellModel?.message}
        />
      </div>

      <CheckboxGroupField
        legend={a.fields.servicesInterest}
        required
        options={serviceOptions}
        field={register("servicesInterest")}
        error={errors.servicesInterest?.message}
      />

      <TextAreaField
        label={a.fields.message}
        required
        rows={5}
        field={register("message")}
        error={errors.message?.message}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2/60 p-4">
        <CheckboxField
          label={a.fields.agreementAck}
          field={register("agreementAck")}
          error={errors.agreementAck?.message}
        />
        <CheckboxField
          label={a.fields.privacyConsent}
          field={register("privacyConsent")}
          error={errors.privacyConsent?.message}
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="flex items-center gap-2 text-sm text-red-400">
          <AlertTriangle size={15} aria-hidden />
          {errorMsg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-vx-blue to-vx-cyan px-6 py-3 text-sm font-semibold text-vx-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? (
          <Loader2 size={16} className="animate-spin" aria-hidden />
        ) : null}
        {status === "submitting" ? a.submitting : a.submit}
      </button>

      <p className="text-xs text-vx-silver-dim">{a.disclaimer}</p>
    </form>
  );
}
