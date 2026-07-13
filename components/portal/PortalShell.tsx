"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";
import LogoutButton from "@/components/auth/LogoutButton";

export type PortalPage =
  | "partner"
  | "agreement"
  | "orders"
  | "partnerOrders"
  | "admin"
  | "files";

/**
 * Shared chrome for every authenticated portal page.
 *
 * It is a Client Component and resolves its own copy from lib/translations.ts,
 * so the Server Components that use it stay free of translation plumbing and
 * the EN/ES toggle keeps working on every portal page.
 */
export default function PortalShell({
  page,
  children,
}: {
  page: PortalPage;
  children: ReactNode;
}) {
  const { t } = useLang();

  const config: Record<
    PortalPage,
    { title: string; subtitle: string; backHref: string; backLabel: string }
  > = {
    partner: {
      title: t.partner.title,
      subtitle: t.partner.subtitle,
      backHref: "/portal",
      backLabel: t.partner.backToPortal,
    },
    agreement: {
      title: t.agreement.title,
      subtitle: t.agreement.signSubtitle,
      backHref: "/portal/partner",
      backLabel: t.partner.title,
    },
    orders: {
      title: t.orders.title,
      subtitle: t.orders.subtitle,
      backHref: "/portal",
      backLabel: t.partner.backToPortal,
    },
    partnerOrders: {
      title: t.orders.partnerTitle,
      subtitle: t.orders.subtitle,
      backHref: "/portal/partner",
      backLabel: t.partner.title,
    },
    admin: {
      title: t.admin.title,
      subtitle: t.admin.subtitle,
      backHref: "/portal",
      backLabel: t.partner.backToPortal,
    },
    files: {
      title: t.files.title,
      subtitle: t.files.subtitle,
      backHref: "/portal",
      backLabel: t.partner.backToPortal,
    },
  };

  const c = config[page];

  return (
    <main className="min-h-screen">
      <header className="border-b border-[rgba(14,165,233,0.12)] bg-vx-bg/80 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-vx-ink">
            VYNTEX
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <Link
          href={c.backHref}
          className="mb-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm text-vx-muted transition-colors hover:text-vx-ink print:hidden"
        >
          <ArrowLeft size={15} aria-hidden />
          {c.backLabel}
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-vx-ink">{c.title}</h1>
          <p className="text-sm text-vx-muted">{c.subtitle}</p>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
