"use client";

import { Printer, AlertTriangle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { AGREEMENT, AGREEMENT_VERSION } from "@/lib/agreement-content";
import GlowCard from "@/components/ui/GlowCard";

/**
 * Renders the full bilingual agreement from lib/agreement-content.ts — the same
 * text that is hashed and written into the PDF. There is no second copy of the
 * agreement anywhere, so what the partner reads is provably what they sign.
 *
 * BOTH languages are always shown, regardless of the UI toggle. The agreement
 * is a legal document: the partner must be able to see the controlling English
 * text even while browsing in Spanish.
 */
export default function AgreementViewer() {
  const { t } = useLang();
  const a = t.agreement;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-vx-ink">{a.title}</h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-vx-blue">
            {a.version.replace("{version}", AGREEMENT_VERSION)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[rgba(14,165,233,0.25)] px-4 py-2.5 text-sm font-medium text-vx-silver transition-colors hover:border-vx-blue hover:text-vx-blue print:hidden"
        >
          <Printer size={15} aria-hidden />
          {a.print}
        </button>
      </div>

      {/* English-controls notice. Restates §8 up front so it can't be missed. */}
      <p className="rounded-xl border border-[rgba(14,165,233,0.20)] bg-vx-bg2/60 px-4 py-3 text-sm text-vx-silver">
        {a.languageNote}
      </p>

      <GlowCard
        as="article"
        className="max-h-[560px] overflow-y-auto p-6 sm:p-7 print:max-h-none print:overflow-visible print:border-0"
      >
        {(["en", "es"] as const).map((lang) => {
          const doc = AGREEMENT[lang];
          return (
            <section key={lang} className="mb-8 last:mb-0">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-vx-blue">
                {lang === "en" ? a.englishHeading : a.spanishHeading}
              </h3>
              <h4 className="mt-2 text-base font-bold text-vx-ink">{doc.title}</h4>
              <p className="mt-1 text-xs text-vx-silver-dim">{doc.partiesLine}</p>

              <div className="mt-5 flex flex-col gap-5">
                {doc.sections.map((section) => (
                  <div key={section.heading}>
                    <h5 className="text-sm font-semibold text-vx-silver">
                      {section.heading}
                    </h5>
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="mt-1.5 text-sm leading-relaxed text-vx-muted"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </GlowCard>

      {/* Attorney-review disclaimer. Preserved verbatim from the source agreement. */}
      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/5 px-4 py-3"
      >
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden />
        <div className="text-sm text-amber-300">
          <p>{AGREEMENT.en.disclaimer}</p>
          <p className="mt-1 text-amber-300/80">{AGREEMENT.es.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
