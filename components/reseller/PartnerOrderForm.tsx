"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertTriangle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import {
  makePartnerOrderSchema,
  type PartnerOrderInput,
} from "@/lib/validation/checkout";
import type { PartnerServiceOption } from "@/components/reseller/wholesale-view";
import {
  SelectField,
  TextField,
  TextAreaField,
  CheckboxField,
} from "@/components/ui/FormFields";
import GlowCard from "@/components/ui/GlowCard";

type Status = "idle" | "submitting" | "error";

/**
 * Lets an active partner place an order at their partner cost.
 *
 * The form sends only a service key — never an amount. The server resolves the
 * partner cost from lib/pricing.ts. Quote-only tiers ("$1,200+") are excluded
 * from the picker entirely, because we will not auto-charge a starting price.
 *
 * Only a partner-chosen reference label is collected. We deliberately do not
 * ask for the end client's name, email, phone, or address: VYNTEX has no
 * business need for the partner's client's personal data.
 */
export default function PartnerOrderForm({
  services,
}: {
  /**
   * Orderable services, resolved SERVER-side from lib/pricing-reseller.ts with
   * quote-only tiers removed. Carries NO prices — only ids and name keys — so
   * nothing confidential enters this component even for an authorized partner.
   */
  services: PartnerServiceOption[];
}) {
  const { t, lang } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef<number>(Date.now());

  const w = t.wholesale;

  const schema = makePartnerOrderSchema({
    required: t.forms.errors.required,
    selectService: t.forms.errors.selectService,
    consent: t.forms.errors.consent,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerOrderInput>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: "", orderType: "partner_wholesale", notes: "" },
  });

  const onSubmit = async (values: PartnerOrderInput) => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          orderType: "partner_wholesale",
          language: lang,
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        url?: string;
        code?: string;
      };

      if (data.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      setErrorMsg(
        data.code === "rate_limited"
          ? t.forms.errors.rateLimited
          : data.code === "partner_not_active"
            ? t.checkout.errors.notActive
            : data.code === "quote_required"
              ? t.checkout.errors.quoteRequired
              : data.code === "payments_unavailable"
                ? t.checkout.errors.unavailable
                : t.checkout.errors.linkFailed,
      );
      setStatus("error");
    } catch {
      setErrorMsg(t.forms.errors.network);
      setStatus("error");
    }
  };

  // Prices are NOT in the option label — the partner already has the full
  // library above this form, and the server prices the order regardless.
  const options = services.map((service) => {
    const nameKey = service.nameKey as keyof typeof t.pricing.items;
    return {
      value: service.id,
      label: `${t.pricing.tabs[service.category]} — ${t.pricing.items[nameKey].name}`,
    };
  });

  return (
    <GlowCard as="section" className="p-6 sm:p-7">
      <h3 className="text-lg font-semibold text-vx-ink">{w.orderHeading}</h3>
      <p className="mt-1.5 text-sm text-vx-muted">{w.orderSubtitle}</p>

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

        <SelectField
          label={w.orderFields.service}
          required
          placeholder={t.checkout.selectService}
          options={options}
          field={register("serviceKey")}
          error={errors.serviceKey?.message}
        />

        <div className="flex flex-col gap-1.5">
          <TextField
            label={w.orderFields.clientReference}
            required
            field={register("clientReference")}
            error={errors.clientReference?.message}
          />
          <p className="text-xs text-vx-silver-dim">
            {w.orderFields.clientReferenceHint}
          </p>
        </div>

        <TextAreaField
          label={`${w.orderFields.notes} (${t.forms.optional})`}
          rows={4}
          field={register("notes")}
          error={errors.notes?.message}
        />

        <CheckboxField
          label={w.orderFields.terms}
          field={register("termsAccepted")}
          error={errors.termsAccepted?.message}
        />

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
          {status === "submitting" ? w.orderSubmitting : w.orderSubmit}
        </button>

        <p className="text-xs text-vx-silver-dim">{t.checkout.poweredBy}</p>
      </form>
    </GlowCard>
  );
}
