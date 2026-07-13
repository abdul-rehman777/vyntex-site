"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, Loader2, FileText, AlertTriangle, Check } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import GlowCard from "@/components/ui/GlowCard";

export interface ClientFileView {
  id: string;
  fileName: string;
  sizeBytes: number;
  createdAt: string;
  direction: "upload" | "deliverable";
}

const MAX_BYTES = 4 * 1024 * 1024;

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Client file exchange.
 *
 * The size and type are checked here so the user gets an instant, specific
 * message instead of a long upload that dies with a 413. The server re-checks
 * both — this is convenience, not the control.
 *
 * Files are downloaded via short-lived signed URLs from a private bucket. There
 * is no public file URL anywhere in this system.
 */
export default function FileManager({ files }: { files: ClientFileView[] }) {
  const { t, lang } = useLang();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string>("");
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  const f = t.files;

  const onPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setNotice(null);

    if (file.size > MAX_BYTES) {
      setNotice({ kind: "err", text: f.errors.tooLarge });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setBusy("upload");
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/files/upload", { method: "POST", body: form });
      const data = (await res.json()) as { ok: boolean; code?: string };

      if (data.ok) {
        setNotice({ kind: "ok", text: f.uploaded });
        router.refresh();
      } else {
        setNotice({
          kind: "err",
          text:
            data.code === "file_too_large"
              ? f.errors.tooLarge
              : data.code === "file_type"
                ? f.errors.badType
                : data.code === "rate_limited"
                  ? t.forms.errors.rateLimited
                  : f.errors.failed,
        });
      }
    } catch {
      setNotice({ kind: "err", text: t.forms.errors.network });
    }
    setBusy("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const download = async (id: string) => {
    setBusy(id);
    setNotice(null);
    try {
      const res = await fetch(`/api/files/download?id=${encodeURIComponent(id)}`);
      const data = (await res.json()) as { ok: boolean; url?: string };
      if (data.ok && data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        setNotice({ kind: "err", text: f.errors.downloadFailed });
      }
    } catch {
      setNotice({ kind: "err", text: t.forms.errors.network });
    }
    setBusy("");
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="flex flex-col gap-6">
      <GlowCard className="p-6 sm:p-7">
        <h2 className="text-lg font-semibold text-vx-ink">{f.upload}</h2>
        <p className="mt-1.5 text-sm text-vx-muted">{f.maxSize}</p>

        <label className="mt-5 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-vx-blue to-vx-cyan px-5 py-3 text-sm font-semibold text-vx-bg transition-opacity hover:opacity-90 has-[:disabled]:opacity-60">
          {busy === "upload" ? (
            <Loader2 size={16} className="animate-spin" aria-hidden />
          ) : (
            <Upload size={16} aria-hidden />
          )}
          {busy === "upload" ? f.uploading : f.choose}
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            disabled={busy === "upload"}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.txt,.csv,.doc,.docx,.xls,.xlsx,.zip"
            onChange={onPick}
          />
        </label>

        {notice ? (
          <p
            role="status"
            className={`mt-4 flex items-start gap-2 text-sm ${
              notice.kind === "ok" ? "text-vx-cyan" : "text-red-400"
            }`}
          >
            {notice.kind === "ok" ? (
              <Check size={15} className="mt-0.5 shrink-0" aria-hidden />
            ) : (
              <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden />
            )}
            {notice.text}
          </p>
        ) : null}
      </GlowCard>

      {files.length === 0 ? (
        <GlowCard className="p-8 text-center">
          <p className="text-sm text-vx-muted">{f.empty}</p>
        </GlowCard>
      ) : (
        <div className="flex flex-col gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[rgba(14,165,233,0.15)] bg-vx-bg3 text-vx-blue">
                  <FileText size={18} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-vx-ink">{file.fileName}</p>
                  <p className="text-xs text-vx-silver-dim">
                    {humanSize(file.sizeBytes)} · {fmtDate(file.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => download(file.id)}
                disabled={busy === file.id}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-[rgba(14,165,233,0.25)] px-4 py-2.5 text-sm font-medium text-vx-silver transition-colors hover:border-vx-blue hover:text-vx-blue disabled:opacity-60"
              >
                {busy === file.id ? (
                  <Loader2 size={15} className="animate-spin" aria-hidden />
                ) : (
                  <Download size={15} aria-hidden />
                )}
                {busy === file.id ? f.preparing : f.download}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
