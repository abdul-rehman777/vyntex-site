"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, RefreshCw, ShieldCheck } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import GlowCard from "@/components/ui/GlowCard";
import Button from "@/components/ui/Button";

export type OrderPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "canceled"
  | "refunded";

/**
 * Post-checkout status.
 *
 * THE RULE: returning from Square does NOT mean paid. The status shown here is
 * read from our database, and our database is only ever set to 'paid' by the
 * signature-verified Square webhook. Until that webhook lands, this component
 * says "confirming" — never "paid".
 *
 * The webhook usually arrives within seconds, so we poll briefly rather than
 * making the buyer wonder. Polling is bounded: after ~60s we stop and offer a
 * manual re-check, so a slow webhook never becomes an infinite spinner.
 */
export default function PaymentStatus({
  initialStatus,
  orderType,
  autoRefresh = true,
}: {
  initialStatus: OrderPaymentStatus;
  orderType: string;
  autoRefresh?: boolean;
}) {
  const { t } = useLang();
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);

  const s = t.orders.success;
  const confirmed = initialStatus === "paid";

  const recheck = useCallback(() => {
    setChecking(true);
    router.refresh();
    // The refresh is a server round-trip; clear the spinner shortly after.
    window.setTimeout(() => setChecking(false), 900);
  }, [router]);

  useEffect(() => {
    if (!autoRefresh || confirmed || attempts >= 12) return;
    const id = window.setTimeout(() => {
      setAttempts((n) => n + 1);
      router.refresh();
    }, 5000);
    return () => window.clearTimeout(id);
  }, [autoRefresh, confirmed, attempts, router]);

  const isPartnerActivation =
    orderType === "reseller_activation" || orderType === "reseller_renewal";

  return (
    <GlowCard
      className={`flex flex-col items-center gap-5 p-8 text-center sm:p-10 ${
        confirmed ? "border-vx-cyan/40" : ""
      }`}
    >
      <span
        className={`grid h-16 w-16 place-items-center rounded-2xl border bg-vx-bg3 ${
          confirmed
            ? "border-vx-cyan/30 text-vx-cyan"
            : "border-vx-blue/30 text-vx-blue"
        }`}
      >
        {confirmed ? (
          <Check size={28} aria-hidden />
        ) : (
          <Loader2 size={28} className="motion-safe:animate-spin" aria-hidden />
        )}
      </span>

      <div>
        <h1 className="text-2xl font-bold text-vx-ink">
          {confirmed ? s.confirmed : s.title}
        </h1>
        <p role="status" aria-live="polite" className="mx-auto mt-2 max-w-md text-sm text-vx-muted">
          {confirmed ? s.confirmedBody : s.body}
        </p>
      </div>

      {/* Status is stated in words, never by color alone. */}
      <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(14,165,233,0.25)] bg-vx-bg px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-vx-silver">
        <ShieldCheck size={13} aria-hidden />
        {confirmed ? s.confirmed : s.pending}
      </p>

      {confirmed && isPartnerActivation ? (
        <p className="rounded-xl border border-vx-cyan/30 bg-vx-bg px-4 py-3 text-sm text-vx-cyan">
          {s.partnerNext}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!confirmed ? (
          <button
            type="button"
            onClick={recheck}
            disabled={checking}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[rgba(14,165,233,0.25)] px-4 py-2.5 text-sm font-medium text-vx-silver transition-colors hover:border-vx-blue hover:text-vx-blue disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={checking ? "motion-safe:animate-spin" : ""}
              aria-hidden
            />
            {s.refresh}
          </button>
        ) : null}

        <Button
          href={isPartnerActivation ? "/portal/partner" : "/portal/orders"}
          variant="primary"
        >
          {isPartnerActivation ? t.partner.title : s.viewOrders}
        </Button>
      </div>
    </GlowCard>
  );
}
