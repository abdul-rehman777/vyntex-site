"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import {
  makeSupportSchema,
  SUPPORT_MESSAGE_MIN,
  type SupportInput,
} from "@/lib/validation/support";
import { TextField, TextAreaField } from "@/components/ui/FormFields";

type Status = "idle" | "submitting" | "success" | "error";

export default function SupportRequestForm() {
  const { t } = useLang();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef<number>(Date.now());

  const schema = makeSupportSchema({
    subjectRequired: t.forms.errors.required,
    messageMin: t.forms.errors.minMessage.replace("{min}", String(SUPPORT_MESSAGE_MIN)),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportInput>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: "" },
  });

  const onSubmit = async (values: SupportInput) => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: startedAt.current }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string };
      if (data.ok) {
        setStatus("success");
        reset({ honeypot: "" });
        router.refresh();
        return;
      }
      setErrorMsg(
        data.code === "rate_limited"
          ? t.forms.errors.rateLimited
          : data.code === "session"
            ? t.forms.errors.session
            : t.portal.support.error,
      );
      setStatus("error");
    } catch {
      setErrorMsg(t.forms.errors.network);
      setStatus("error");
    }
  };

  const s = t.portal.support;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("honeypot")} />

      <TextField
        label={s.subjectLabel}
        required
        placeholder={s.subjectPlaceholder}
        field={register("subject")}
        error={errors.subject?.message}
      />
      <TextAreaField
        label={s.messageLabel}
        required
        placeholder={s.messagePlaceholder}
        field={register("message")}
        error={errors.message?.message}
      />

      {status === "success" ? (
        <p role="status" className="inline-flex items-center gap-2 text-sm text-vx-cyan">
          <Check size={15} aria-hidden />
          {s.created}
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm text-red-400">
          {errorMsg}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-vx-blue to-vx-cyan px-5 py-2.5 text-sm font-semibold text-vx-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "submitting" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
          {status === "submitting" ? s.creating : s.create}
        </button>
      </div>
    </form>
  );
}
