"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number>(Date.now());

  const mapError = (code?: string): string => {
    const e = t.auth.errors;
    switch (code) {
      case "invalidEmail":
        return e.invalidEmail;
      case "tooManyRequests":
        return e.tooManyRequests;
      case "otpFailed":
        return e.otpFailed;
      default:
        return e.generic;
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          honeypot: honeypot.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string };
      if (data.ok) {
        router.push(`/verify?email=${encodeURIComponent(email)}&lang=${lang}`);
        return;
      }
      setError(mapError(data.code));
      setStatus("error");
    } catch {
      setError(t.forms.errors.network);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <input ref={honeypot} type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-sm text-vx-silver">
          {t.auth.login.emailLabel}
        </label>
        <div className="relative">
          <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-vx-silver-dim" aria-hidden />
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.login.emailPlaceholder}
            className="w-full rounded-xl border border-[rgba(14,165,233,0.18)] bg-vx-bg py-2.5 pl-10 pr-3.5 text-sm text-vx-ink placeholder:text-vx-silver-dim focus-visible:border-vx-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vx-blue/40"
          />
        </div>
      </div>

      {status === "error" ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="primary" fullWidth disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            {t.forms.sending}
          </>
        ) : (
          t.auth.login.submit
        )}
      </Button>
    </form>
  );
}
