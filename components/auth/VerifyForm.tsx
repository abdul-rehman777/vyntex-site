"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";

const RESEND_SECONDS = 45;

export default function VerifyForm({ email }: { email: string }) {
  const { t } = useLang();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const mapError = (code?: string): string => {
    const e = t.auth.errors;
    switch (code) {
      case "invalidCode":
        return e.invalidCode;
      case "expiredCode":
        return e.expiredCode;
      case "tooManyRequests":
        return e.tooManyRequests;
      default:
        return e.generic;
    }
  };

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("verifying");
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string };
      if (data.ok) {
        router.push("/portal");
        router.refresh();
        return;
      }
      setError(mapError(data.code));
      setStatus("error");
    } catch {
      setError(t.forms.errors.network);
      setStatus("error");
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, startedAt: startedAt.current }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string };
      if (data.ok) {
        setNotice(t.auth.notices.codeResent);
        setCooldown(RESEND_SECONDS);
      } else {
        setError(mapError(data.code));
      }
    } catch {
      setError(t.forms.errors.network);
    }
  };

  return (
    <form onSubmit={verify} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="otp-code" className="text-sm text-vx-silver">
          {t.auth.verify.codeLabel}
        </label>
        <div className="relative">
          <ShieldCheck size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-vx-silver-dim" aria-hidden />
          <input
            id="otp-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{8}"
            maxLength={8}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder={t.auth.verify.codePlaceholder}
            className="w-full rounded-xl border border-[rgba(14,165,233,0.18)] bg-vx-bg py-2.5 pl-10 pr-3.5 text-center font-mono text-lg tracking-[0.4em] text-vx-ink placeholder:tracking-normal placeholder:text-vx-silver-dim focus-visible:border-vx-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vx-blue/40"
          />
        </div>
      </div>

      {notice ? (
        <p role="status" className="rounded-lg border border-vx-cyan/25 bg-vx-cyan/10 px-3 py-2 text-sm text-vx-cyan">
          {notice}
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="primary" fullWidth disabled={status === "verifying" || code.length !== 8}>
        {status === "verifying" ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            {t.forms.sending}
          </>
        ) : (
          t.auth.verify.submit
        )}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="text-vx-blue hover:text-vx-cyan disabled:cursor-not-allowed disabled:text-vx-silver-dim"
        >
          {cooldown > 0
            ? t.auth.verify.resendIn.replace("{seconds}", String(cooldown))
            : t.auth.verify.resend}
        </button>
        <Link href="/login" className="text-vx-muted hover:text-vx-ink">
          {t.auth.verify.changeEmail}
        </Link>
      </div>
    </form>
  );
}
