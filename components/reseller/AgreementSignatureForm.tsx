"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, AlertTriangle, Info } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { makeSignatureSchema, type SignatureInput } from "@/lib/validation/reseller";
import { AGREEMENT_VERSION } from "@/lib/agreement-content";
import { TextField, CheckboxField, FactRow } from "@/components/ui/FormFields";
import GlowCard from "@/components/ui/GlowCard";
import Button from "@/components/ui/Button";

type Status = "idle" | "submitting" | "signed" | "partial" | "error";

export interface SignedSummary {
  signedName: string;
  signedAt: string;
  version: string;
  hash: string;
}

/**
 * Typed-name electronic signature.
 *
 * The typed signature must exactly match the full legal name — that match is
 * what makes this a deliberate act rather than a stray click. The server
 * re-validates the same rule; this is convenience, not enforcement.
 *
 * We state plainly what this is and is not. We do not imply certificate-based
 * e-signature (DocuSign et al.) equivalency anywhere.
 */
export default function AgreementSignatureForm({
  defaultEmail,
  defaultBusinessName,
  alreadySigned,
}: {
  defaultEmail: string;
  defaultBusinessName: string;
  alreadySigned: SignedSummary | null;
}) {
  const { t, lang } = useLang();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef<number>(Date.now());

  const a = t.agreement;

  const schema = makeSignatureSchema({
    required: t.forms.errors.required,
    invalidEmail: t.forms.errors.invalidEmail,
    consent: t.forms.errors.consent,
    nameMismatch: a.errors.nameMismatch,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignatureInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      honeypot: "",
      email: defaultEmail,
      legalBusinessName: defaultBusinessName,
    },
  });

  const onSubmit = async (values: SignatureInput) => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/reseller/agreement/sign", {
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
        setStatus(data.partial ? "partial" : "signed");
        router.refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setErrorMsg(
        data.code === "rate_limited"
          ? t.forms.errors.rateLimited
          : data.code === "session"
            ? t.forms.errors.session
            : data.code === "not_a_partner"
              ? a.errors.notPartner
              : data.code === "partner_inactive"
                ? a.errors.inactive
                : t.forms.errors.server,
      );
      setStatus("error");
    } catch {
      setErrorMsg(t.forms.errors.network);
      setStatus("error");
    }
  };

  // --- Already signed: show the record, not the form ----------------------
  if (alreadySigned && status === "idle") {
    return (
      <GlowCard className="flex flex-col gap-4 border-vx-cyan/40 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-vx-cyan/30 bg-vx-bg3 text-vx-cyan">
            <Check size={20} aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-vx-ink">{a.signedTitle}</h3>
            <p className="mt-1 text-sm text-vx-muted">{a.alreadySigned}</p>
          </div>
        </div>

        <div className="flex flex-col">
          <FactRow label={a.signedFacts.signedBy} value={alreadySigned.signedName} />
          <FactRow
            label={a.signedFacts.signedAt}
            value={new Date(alreadySigned.signedAt).toLocaleString(
              lang === "es" ? "es-US" : "en-US",
            )}
          />
          <FactRow label={a.signedFacts.version} value={alreadySigned.version} />
        </div>

        <div className="rounded-lg border border-[rgba(14,165,233,0.12)] bg-vx-bg px-3 py-2.5">
          <p className="text-xs uppercase tracking-wide text-vx-muted">
            {a.signedFacts.hash}
          </p>
          <p className="mt-1 break-all font-mono text-[0.7rem] text-vx-silver">
            {alreadySigned.hash}
          </p>
        </div>

        <Button href="/portal/partner" variant="primary">
          {t.partner.title}
        </Button>
      </GlowCard>
    );
  }

  // --- Just signed --------------------------------------------------------
  if (status === "signed" || status === "partial") {
    return (
      <GlowCard className="flex flex-col items-center gap-4 border-vx-cyan/40 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-vx-cyan/30 bg-vx-bg3 text-vx-cyan">
          <Check size={26} aria-hidden />
        </span>
        <h3 className="text-xl font-bold text-vx-ink">{a.signedTitle}</h3>
        <p role="status" className="max-w-md text-sm text-vx-muted">
          {status === "partial" ? a.signedPartialBody : a.signedBody}
        </p>
        <Button href="/portal/partner" variant="primary">
          {t.partner.states.signedUnpaid.cta.replace("{fee}", "$199")}
        </Button>
      </GlowCard>
    );
  }

  const today = new Date().toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <GlowCard as="section" className="p-6 sm:p-7">
      <h3 className="text-lg font-semibold text-vx-ink">{a.signHeading}</h3>
      <p className="mt-1.5 text-sm text-vx-muted">{a.signSubtitle}</p>

      {/* Honest scope disclosure. */}
      <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-[rgba(14,165,233,0.20)] bg-vx-bg/60 px-3.5 py-3 text-xs text-vx-silver-dim">
        <Info size={14} className="mt-0.5 shrink-0 text-vx-blue" aria-hidden />
        {a.notDocusign}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-5"
        noValidate
      >
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
            label={a.fields.fullLegalName}
            required
            autoComplete="name"
            field={register("fullLegalName")}
            error={errors.fullLegalName?.message}
          />
          <TextField
            label={a.fields.legalBusinessName}
            required
            autoComplete="organization"
            field={register("legalBusinessName")}
            error={errors.legalBusinessName?.message}
          />
          <TextField
            label={a.fields.signerTitle}
            required
            autoComplete="organization-title"
            field={register("signerTitle")}
            error={errors.signerTitle?.message}
          />
          <TextField
            label={a.fields.email}
            required
            type="email"
            autoComplete="email"
            field={register("email")}
            error={errors.email?.message}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-vx-silver">{a.fields.date}</span>
          <p className="rounded-xl border border-[rgba(14,165,233,0.12)] bg-vx-bg/60 px-3.5 py-2.5 text-sm text-vx-muted">
            {today}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2/60 p-4">
          <CheckboxField
            label={a.fields.agreementAccepted}
            field={register("agreementAccepted")}
            error={errors.agreementAccepted?.message}
          />
          <CheckboxField
            label={a.fields.signatureConsent}
            field={register("signatureConsent")}
            error={errors.signatureConsent?.message}
          />
        </div>

        {/* The signature itself. Serif italic so it reads as a signature line. */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="typedSignature"
            className="text-sm text-vx-silver"
          >
            {a.fields.typedSignature} <span className="text-vx-blue">*</span>
          </label>
          <input
            id="typedSignature"
            type="text"
            autoComplete="off"
            aria-invalid={Boolean(errors.typedSignature)}
            className="rounded-xl border border-[rgba(14,165,233,0.30)] bg-vx-bg px-3.5 py-3 font-serif text-lg italic text-vx-ink placeholder:text-vx-silver-dim focus-visible:border-vx-blue"
            {...register("typedSignature")}
          />
          {errors.typedSignature?.message ? (
            <p className="text-xs text-red-400">{errors.typedSignature.message}</p>
          ) : null}
          <p className="font-mono text-[0.65rem] uppercase tracking-wide text-vx-silver-dim">
            {a.version.replace("{version}", AGREEMENT_VERSION)}
          </p>
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
          {status === "submitting" ? a.signing : a.signSubmit}
        </button>
      </form>
    </GlowCard>
  );
}
