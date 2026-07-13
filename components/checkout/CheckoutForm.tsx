"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertTriangle, Lock } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { makeCheckoutSchema, type CheckoutInput } from "@/lib/validation/checkout";
import { PRICING_CATEGORIES, DIRECT_PRICING, parseMoney } from "@/lib/pricing";
import { SECTION_IDS } from "@/lib/site";
import {
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
} from "@/components/ui/FormFields";
import GlowCard from "@/components/ui/GlowCard";
import OrderSummary from "@/components/checkout/OrderSummary";
import Button from "@/components/ui/Button";

type Status = "idle" | "submitting" | "redirecting" | "error";

/**
 * Public checkout. Sends a service KEY and buyer details — never a price. The
 * server resolves the amount from lib/pricing.ts and creates a Square-hosted
 * payment link. No card field exists on this page, by design: card data never
 * touches vyntexusa.com.
 */
export default function CheckoutForm() {
  const { t, lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef<number>(Date.now());

  const c = t.checkout;
  const initialService = searchParams.get("service") ?? "";

  const schema = makeCheckoutSchema({
    required: t.forms.errors.required,
    invalidEmail: t.forms.errors.invalidEmail,
    invalidPhone: t.forms.errors.invalidPhone,
    consent: t.forms.errors.consent,
    selectService: t.forms.errors.selectService,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      honeypot: "",
      orderType: "direct",
      serviceKey: initialService,
      businessName: "",
      phone: "",
      notes: "",
    },
  });

  // Keep the URL in sync so a chosen service survives refresh and sharing.
  const serviceKey = watch("serviceKey");

  useEffect(() => {
    if (initialService && initialService !== serviceKey) {
      setValue("serviceKey", initialService);
    }
    // Only on mount / when the query param itself changes.
  }, [initialService, serviceKey, setValue]);

  useEffect(() => {
    if (!serviceKey) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("service") !== serviceKey) {
      url.searchParams.set("service", serviceKey);
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [serviceKey, router]);

  const onSubmit = async (values: CheckoutInput) => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          orderType: "direct",
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
        setStatus("redirecting");
        window.location.href = data.url;
        return;
      }

      setErrorMsg(
        data.code === "rate_limited"
          ? t.forms.errors.rateLimited
          : data.code === "payments_unavailable"
            ? c.errors.unavailable
            : data.code === "quote_required"
              ? c.errors.quoteRequired
              : data.code === "spam"
                ? t.forms.errors.spam
                : c.errors.linkFailed,
      );
      setStatus("error");
    } catch {
      setErrorMsg(t.forms.errors.network);
      setStatus("error");
    }
  };

  // Only purchasable tiers. "$2,000+" starting prices are excluded — they route
  // to a consultation instead of a payment link.
  const options = PRICING_CATEGORIES.flatMap((category) =>
    DIRECT_PRICING.filter(
      (tier) => tier.category === category && !parseMoney(tier.price).quoteOnly,
    ).map((tier) => {
      const nameKey = tier.nameKey as keyof typeof t.pricing.items;
      return {
        value: tier.id,
        label: `${t.pricing.tabs[category]} — ${t.pricing.items[nameKey].name} · ${tier.price}`,
      };
    }),
  );

  const busy = status === "submitting" || status === "redirecting";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      <GlowCard as="section" className="p-6 sm:p-7">
        <h2 className="text-lg font-semibold text-vx-ink">{c.detailsHeading}</h2>

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
            label={c.selectService}
            required
            placeholder={c.selectService}
            options={options}
            field={register("serviceKey")}
            error={errors.serviceKey?.message}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label={c.fields.fullName}
              required
              autoComplete="name"
              field={register("fullName")}
              error={errors.fullName?.message}
            />
            <TextField
              label={`${c.fields.businessName} (${t.forms.optional})`}
              autoComplete="organization"
              field={register("businessName")}
              error={errors.businessName?.message}
            />
            <TextField
              label={c.fields.email}
              required
              type="email"
              autoComplete="email"
              field={register("email")}
              error={errors.email?.message}
            />
            <TextField
              label={`${c.fields.phone} (${t.forms.optional})`}
              type="tel"
              autoComplete="tel"
              field={register("phone")}
              error={errors.phone?.message}
            />
          </div>

          <TextAreaField
            label={`${c.fields.notes} (${t.forms.optional})`}
            rows={4}
            field={register("notes")}
            error={errors.notes?.message}
          />

          <div className="flex flex-col gap-3 rounded-xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2/60 p-4">
            <CheckboxField
              label={c.fields.terms}
              field={register("termsAccepted")}
              error={errors.termsAccepted?.message}
            />
            <CheckboxField
              label={c.fields.privacy}
              field={register("privacyAccepted")}
              error={errors.privacyAccepted?.message}
            />
          </div>

          {status === "error" ? (
            <p role="alert" className="flex items-start gap-2 text-sm text-red-400">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden />
              {errorMsg}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-vx-blue to-vx-cyan px-6 py-3 text-sm font-semibold text-vx-bg transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
            {status === "redirecting"
              ? c.redirecting
              : status === "submitting"
                ? c.submitting
                : c.submit}
          </button>

          <p className="flex items-center gap-2 text-xs text-vx-silver-dim">
            <Lock size={13} aria-hidden />
            {c.poweredBy}
          </p>

          <p className="border-t border-[rgba(14,165,233,0.12)] pt-4 text-xs text-vx-silver-dim">
            {c.quoteOnly}{" "}
            <Button
              href={`/#${SECTION_IDS.contact}`}
              variant="ghost"
              size="sm"
              className="mt-2"
            >
              {t.actions.bookConsultation}
            </Button>
          </p>
        </form>
      </GlowCard>

      <div className="lg:sticky lg:top-24">
        <OrderSummary serviceKey={serviceKey} />
      </div>
    </div>
  );
}
