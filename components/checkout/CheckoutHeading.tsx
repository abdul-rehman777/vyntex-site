"use client";

import { useLang } from "@/context/LanguageContext";

export default function CheckoutHeading() {
  const { t } = useLang();
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold leading-tight text-vx-ink sm:text-4xl">
        {t.checkout.title}
      </h1>
      <p className="mt-3 text-vx-muted">{t.checkout.subtitle}</p>
    </div>
  );
}
