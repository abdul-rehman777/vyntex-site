"use client";

import { useLang } from "@/context/LanguageContext";

/**
 * EN / ES pill toggle. Uses the language context (persists to localStorage).
 * Accessible: a radiogroup with two exclusive options and aria-checked state,
 * so it does not rely on color alone to indicate the active language.
 */
export default function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();

  const optionClasses = (active: boolean) =>
    [
      "px-3 py-1 text-xs font-semibold font-mono rounded-full transition-colors",
      active ? "bg-vx-blue text-vx-bg" : "text-vx-muted hover:text-vx-ink",
    ].join(" ");

  return (
    <div
      role="radiogroup"
      aria-label={`${t.language.en} / ${t.language.es}`}
      className={[
        "inline-flex items-center rounded-full border border-[rgba(14,165,233,0.25)] p-0.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        role="radio"
        aria-checked={lang === "en"}
        aria-label={t.language.switchToEn}
        onClick={() => setLang("en")}
        className={optionClasses(lang === "en")}
      >
        EN
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={lang === "es"}
        aria-label={t.language.switchToEs}
        onClick={() => setLang("es")}
        className={optionClasses(lang === "es")}
      >
        ES
      </button>
    </div>
  );
}
