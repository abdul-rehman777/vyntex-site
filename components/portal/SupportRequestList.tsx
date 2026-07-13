"use client";

import { useLang } from "@/context/LanguageContext";

export interface SupportRequestRow {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
}

const STATUS_STYLES: Record<SupportRequestRow["status"], string> = {
  open: "border-vx-blue/40 text-vx-blue",
  in_progress: "border-vx-cyan/40 text-vx-cyan",
  resolved: "border-emerald-500/40 text-emerald-400",
  closed: "border-vx-silver-dim/40 text-vx-silver-dim",
};

export default function SupportRequestList({ requests }: { requests: SupportRequestRow[] }) {
  const { t, lang } = useLang();

  if (requests.length === 0) {
    return <p className="text-sm text-vx-muted">{t.portal.empty.support}</p>;
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <ul className="flex flex-col gap-3">
      {requests.map((r) => (
        <li
          key={r.id}
          className="rounded-xl border border-[rgba(14,165,233,0.14)] bg-vx-bg p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-sm font-semibold text-vx-ink">{r.subject}</h4>
            <span
              className={[
                "shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide",
                STATUS_STYLES[r.status],
              ].join(" ")}
            >
              {t.portal.status[r.status]}
            </span>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-vx-muted">{r.message}</p>
          <p className="mt-2 font-mono text-[0.62rem] text-vx-silver-dim">
            {t.portal.support.createdAt}: {fmt(r.created_at)}
          </p>
        </li>
      ))}
    </ul>
  );
}
