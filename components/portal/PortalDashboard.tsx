"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Link2,
  ShoppingBag,
  FileSignature,
  FolderOpen,
  Handshake,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import type { UserProfile } from "@/lib/auth";
import GlowCard from "@/components/ui/GlowCard";
import LanguageToggle from "@/components/ui/LanguageToggle";
import LogoutButton from "@/components/auth/LogoutButton";
import ProfileForm from "@/components/portal/ProfileForm";
import SupportRequestForm from "@/components/portal/SupportRequestForm";
import SupportRequestList, {
  type SupportRequestRow,
} from "@/components/portal/SupportRequestList";

export default function PortalDashboard({
  profile,
  requests,
  email,
  partnerState,
  isAdmin,
}: {
  profile: UserProfile;
  requests: SupportRequestRow[];
  email: string;
  /**
   * Resolved SERVER-side by lib/reseller.ts. Used only to choose which link to
   * show — it carries no pricing and grants nothing on its own.
   */
  partnerState: string;
  /**
   * Resolved SERVER-side against the admin_users table. Used only to decide
   * whether to SHOW the link — /portal/admin re-checks on every request, so a
   * forged prop grants nothing.
   */
  isAdmin: boolean;
}) {
  const { t } = useLang();
  const displayName = profile.full_name?.trim() || email;
  const isPartner = partnerState !== "none";

  return (
    <main className="min-h-screen">
      <header className="border-b border-[rgba(14,165,233,0.12)] bg-vx-bg/80 backdrop-blur">
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
        {/* Welcome */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-vx-ink">
            {t.portal.welcome}, {displayName}
          </h1>
          <p className="text-sm text-vx-muted">
            {t.portal.signedInAs} <span className="text-vx-silver">{email}</span> · {t.portal.manageAccount}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Profile */}
          <GlowCard className="p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-vx-ink">{t.portal.sections.profile}</h2>
            <div className="mt-4">
              <ProfileForm profile={profile} />
            </div>
          </GlowCard>

          {/* Support */}
          <GlowCard className="p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-vx-ink">{t.portal.sections.support}</h2>
            <div className="mt-4">
              <SupportRequestForm />
            </div>
            <div className="mt-6">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-vx-blue">
                {t.portal.support.listTitle}
              </h3>
              <SupportRequestList requests={requests} />
            </div>
          </GlowCard>
        </div>

        {/* Administrator (only rendered for a verified admin) */}
        {isAdmin ? (
          <GlowCard className="mt-6 flex flex-col gap-4 border-vx-cyan/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-vx-cyan/30 bg-vx-bg3 text-vx-cyan">
                <ShieldCheck size={20} aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-semibold text-vx-ink">
                  {t.admin.title}
                </h2>
                <p className="mt-1 text-sm text-vx-muted">{t.admin.subtitle}</p>
              </div>
            </div>
            <Link
              href="/portal/admin"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-vx-cyan/40 px-4 py-2.5 text-sm font-medium text-vx-cyan transition-colors hover:border-vx-cyan"
            >
              {t.admin.title}
              <ArrowRight size={15} aria-hidden />
            </Link>
          </GlowCard>
        ) : null}

        {/* Partner program */}
        <GlowCard className="mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-vx-blue/25 bg-vx-bg3 text-vx-blue">
              <Handshake size={20} aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-vx-ink">
                {isPartner ? t.partner.title : t.partner.states.none.title}
              </h2>
              <p className="mt-1 text-sm text-vx-muted">
                {isPartner
                  ? t.partner.subtitle
                  : t.partner.states.none.body}
              </p>
            </div>
          </div>
          <Link
            href={isPartner ? "/portal/partner" : "/partners/apply"}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[rgba(14,165,233,0.25)] px-4 py-2.5 text-sm font-medium text-vx-silver transition-colors hover:border-vx-blue hover:text-vx-blue"
          >
            {isPartner ? t.partner.title : t.partner.states.none.cta}
            <ArrowRight size={15} aria-hidden />
          </Link>
        </GlowCard>

        {/* Orders + remaining placeholders */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/portal/orders"
            className="flex flex-col gap-2 rounded-2xl border border-[rgba(14,165,233,0.16)] bg-vx-bg2/60 p-5 transition-colors hover:border-vx-blue/50"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-[rgba(14,165,233,0.15)] bg-vx-bg3 text-vx-blue">
              <ShoppingBag size={18} aria-hidden />
            </span>
            <h3 className="text-sm font-semibold text-vx-silver">
              {t.portal.sections.orders}
            </h3>
            <p className="text-xs text-vx-muted">{t.orders.subtitle}</p>
          </Link>

          <Link
            href="/portal/files"
            className="flex flex-col gap-2 rounded-2xl border border-[rgba(14,165,233,0.16)] bg-vx-bg2/60 p-5 transition-colors hover:border-vx-blue/50"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-[rgba(14,165,233,0.15)] bg-vx-bg3 text-vx-blue">
              <FolderOpen size={18} aria-hidden />
            </span>
            <h3 className="text-sm font-semibold text-vx-silver">
              {t.portal.sections.files}
            </h3>
            <p className="text-xs text-vx-muted">{t.files.subtitle}</p>
          </Link>

          <Link
            href={isPartner ? "/portal/partner/agreement" : "/partners/apply"}
            className="flex flex-col gap-2 rounded-2xl border border-[rgba(14,165,233,0.16)] bg-vx-bg2/60 p-5 transition-colors hover:border-vx-blue/50"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-[rgba(14,165,233,0.15)] bg-vx-bg3 text-vx-blue">
              <FileSignature size={18} aria-hidden />
            </span>
            <h3 className="text-sm font-semibold text-vx-silver">
              {t.portal.sections.agreements}
            </h3>
            <p className="text-xs text-vx-muted">
              {isPartner ? t.agreement.title : t.portal.empty.agreements}
            </p>
          </Link>

          <Placeholder icon={<Link2 size={18} aria-hidden />} title={t.portal.sections.projects} empty={t.portal.empty.projects} />
        </div>
      </div>
    </main>
  );
}

function Placeholder({
  icon,
  title,
  empty,
}: {
  icon: ReactNode;
  title: string;
  empty: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-[rgba(14,165,233,0.16)] bg-vx-bg2/40 p-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-[rgba(14,165,233,0.15)] bg-vx-bg3 text-vx-silver-dim">
        {icon}
      </span>
      <h3 className="text-sm font-semibold text-vx-silver">{title}</h3>
      <p className="text-xs text-vx-muted">{empty}</p>
    </div>
  );
}
