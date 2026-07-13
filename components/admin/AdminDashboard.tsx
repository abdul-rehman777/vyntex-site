"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { formatCents } from "@/lib/order-types";
import GlowCard from "@/components/ui/GlowCard";

/**
 * Administrator dashboard.
 *
 * Every piece of data here was fetched by a Server Component that already
 * verified the caller against the `admin_users` table. This component renders;
 * it does not authorize. Mutations POST to /api/admin/*, which re-checks admin
 * status server-side — the UI being visible is never taken as permission.
 *
 * Note there is no wholesale pricing here, even for an admin. An admin manages
 * partners; they do not need the price book rendered in a browser tab.
 */

export interface AdminApplicationView {
  id: string;
  createdAt: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  clientCount: string;
  resellModel: string;
  message: string;
}

export interface AdminPartnerView {
  id: string;
  partnerNumber: string;
  businessName: string;
  contactName: string;
  email: string;
  status: string;
  expirationDate: string | null;
  salesCount: number;
  minimumRequired: number;
}

export interface AdminOrderView {
  id: string;
  createdAt: string;
  customerEmail: string;
  itemName: string;
  orderType: string;
  status: string;
  total: number;
}

export interface AdminSystemView {
  squareEnvironment: "sandbox" | "production";
  emailPending: number;
  emailAbandoned: number;
  emailSent: number;
  cronRuns: { job: string; status: string; createdAt: string }[];
  missingConfig: string[];
}

type Tab = "applications" | "partners" | "orders" | "system";

export default function AdminDashboard({
  applications,
  partners,
  orders,
  system,
}: {
  applications: AdminApplicationView[];
  partners: AdminPartnerView[];
  orders: AdminOrderView[];
  system: AdminSystemView;
}) {
  const { t, lang } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("applications");
  const [busy, setBusy] = useState<string>("");
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  const a = t.admin;

  const fmtDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const act = async (
    endpoint: string,
    body: Record<string, string>,
    key: string,
    onOk: (data: Record<string, unknown>) => string,
  ) => {
    setBusy(key);
    setNotice(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        ok: boolean;
        code?: string;
        message?: string;
        partnerNumber?: string;
      };

      if (data.ok) {
        setNotice({ kind: "ok", text: onOk(data as Record<string, unknown>) });
        router.refresh();
      } else if (data.code === "rate_limited") {
        setNotice({ kind: "err", text: a.errors.rateLimited });
      } else if (data.code === "approve_failed") {
        // The DB function raises a readable exception when the applicant has
        // never signed in. That is the single most likely admin error, so it
        // gets a real explanation instead of "something went wrong".
        const noUser = (data.message ?? "").includes("must sign in once");
        setNotice({
          kind: "err",
          text: noUser ? a.applications.noAuthUser : a.errors.failed,
        });
      } else {
        setNotice({ kind: "err", text: a.errors.failed });
      }
    } catch {
      setNotice({ kind: "err", text: a.errors.failed });
    }
    setBusy("");
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "applications", label: a.tabs.applications, count: applications.length },
    { key: "partners", label: a.tabs.partners, count: partners.length },
    { key: "orders", label: a.tabs.orders, count: orders.length },
    { key: "system", label: a.tabs.system },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Square mode banner. If real cards are being charged, an admin should
          never be able to miss it. */}
      <div
        role="note"
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
          system.squareEnvironment === "production"
            ? "border-amber-500/50 bg-amber-500/5 text-amber-300"
            : "border-vx-blue/40 bg-vx-blue/5 text-vx-blue"
        }`}
      >
        {system.squareEnvironment === "production" ? (
          <ShieldAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
        ) : (
          <ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden />
        )}
        <p className="text-sm font-medium">
          {a.system.squareMode}:{" "}
          {system.squareEnvironment === "production"
            ? a.system.production
            : a.system.sandbox}
        </p>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label={a.title}
        className="flex flex-wrap gap-2 border-b border-[rgba(14,165,233,0.12)] pb-3"
      >
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            onClick={() => setTab(item.key)}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === item.key
                ? "bg-vx-bg2 text-vx-ink"
                : "text-vx-muted hover:text-vx-ink"
            }`}
          >
            {item.label}
            {typeof item.count === "number" && item.count > 0 ? (
              <span className="rounded-full bg-vx-blue/15 px-1.5 py-0.5 font-mono text-[0.65rem] text-vx-blue">
                {item.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {notice ? (
        <p
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            notice.kind === "ok"
              ? "border-vx-cyan/40 bg-vx-cyan/5 text-vx-cyan"
              : "border-red-500/40 bg-red-500/5 text-red-400"
          }`}
        >
          {notice.text}
        </p>
      ) : null}

      {/* ---- Applications ---- */}
      {tab === "applications" ? (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-vx-silver-dim">{a.applications.approvalNote}</p>

          {applications.length === 0 ? (
            <GlowCard className="p-8 text-center">
              <p className="text-sm text-vx-muted">{a.applications.empty}</p>
            </GlowCard>
          ) : (
            applications.map((app) => (
              <GlowCard key={app.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-vx-ink">{app.businessName}</h3>
                    <p className="mt-0.5 text-sm text-vx-muted">
                      {app.fullName} · {app.email} · {app.phone}
                    </p>
                    <p className="mt-0.5 text-xs text-vx-silver-dim">
                      {app.city}, {app.state} · {app.clientCount} · {app.resellModel} ·{" "}
                      {fmtDate(app.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-500/40 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wide text-amber-400">
                    {a.applications.pending}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap rounded-lg border border-[rgba(14,165,233,0.10)] bg-vx-bg p-3 text-sm text-vx-silver">
                  {app.message}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={busy === app.id}
                    onClick={() =>
                      act(
                        "/api/admin/applications",
                        { applicationId: app.id, action: "approve" },
                        app.id,
                        (d) =>
                          a.applications.approved.replace(
                            "{number}",
                            String(d.partnerNumber ?? ""),
                          ),
                      )
                    }
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-vx-blue to-vx-cyan px-4 py-2.5 text-sm font-semibold text-vx-bg transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {busy === app.id ? (
                      <Loader2 size={15} className="animate-spin" aria-hidden />
                    ) : (
                      <Check size={15} aria-hidden />
                    )}
                    {busy === app.id ? a.applications.approving : a.applications.approve}
                  </button>

                  <button
                    type="button"
                    disabled={busy === app.id}
                    onClick={() => {
                      if (!window.confirm(a.applications.confirmReject)) return;
                      void act(
                        "/api/admin/applications",
                        { applicationId: app.id, action: "reject" },
                        app.id,
                        () => a.applications.rejected,
                      );
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:border-red-500/60 disabled:opacity-60"
                  >
                    <X size={15} aria-hidden />
                    {a.applications.reject}
                  </button>
                </div>
              </GlowCard>
            ))
          )}
        </div>
      ) : null}

      {/* ---- Partners ---- */}
      {tab === "partners" ? (
        partners.length === 0 ? (
          <GlowCard className="p-8 text-center">
            <p className="text-sm text-vx-muted">{a.partners.empty}</p>
          </GlowCard>
        ) : (
          <div className="flex flex-col gap-3">
            {partners.map((p) => (
              <GlowCard key={p.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-vx-cyan">{p.partnerNumber}</p>
                    <h3 className="mt-0.5 font-semibold text-vx-ink">
                      {p.businessName}
                    </h3>
                    <p className="mt-0.5 text-xs text-vx-silver-dim">
                      {p.contactName} · {p.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full border border-[rgba(14,165,233,0.25)] px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wide text-vx-silver">
                      {t.partner.statusLabels[
                        p.status as keyof typeof t.partner.statusLabels
                      ] ?? p.status}
                    </span>
                    <p className="mt-1.5 text-xs text-vx-muted">
                      {a.partners.columns.expires}: {fmtDate(p.expirationDate)}
                    </p>
                    <p className="text-xs text-vx-muted">
                      {a.partners.columns.sales}: {p.salesCount} / {p.minimumRequired}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.status === "suspended" ? (
                    <button
                      type="button"
                      disabled={busy === p.id}
                      onClick={() =>
                        act(
                          "/api/admin/partners",
                          { partnerId: p.id, status: "active" },
                          p.id,
                          () => a.partners.updated,
                        )
                      }
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-vx-cyan/40 px-4 py-2.5 text-sm font-medium text-vx-cyan hover:border-vx-cyan"
                    >
                      {a.partners.reinstate}
                    </button>
                  ) : p.status !== "terminated" ? (
                    <button
                      type="button"
                      disabled={busy === p.id}
                      onClick={() =>
                        act(
                          "/api/admin/partners",
                          { partnerId: p.id, status: "suspended" },
                          p.id,
                          () => a.partners.updated,
                        )
                      }
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-amber-500/30 px-4 py-2.5 text-sm font-medium text-amber-400 hover:border-amber-500/60"
                    >
                      {a.partners.suspend}
                    </button>
                  ) : null}

                  {p.status !== "terminated" ? (
                    <button
                      type="button"
                      disabled={busy === p.id}
                      onClick={() => {
                        if (!window.confirm(a.partners.confirmTerminate)) return;
                        void act(
                          "/api/admin/partners",
                          { partnerId: p.id, status: "terminated" },
                          p.id,
                          () => a.partners.updated,
                        );
                      }}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:border-red-500/60"
                    >
                      {a.partners.terminate}
                    </button>
                  ) : null}
                </div>
              </GlowCard>
            ))}
          </div>
        )
      ) : null}

      {/* ---- Orders ---- */}
      {tab === "orders" ? (
        orders.length === 0 ? (
          <GlowCard className="p-8 text-center">
            <p className="text-sm text-vx-muted">{a.orders.empty}</p>
          </GlowCard>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-vx-silver-dim">{a.orders.paidNote}</p>
            <div className="overflow-hidden rounded-2xl border border-[rgba(14,165,233,0.14)]">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">{a.tabs.orders}</caption>
                <thead>
                  <tr className="bg-vx-bg2 text-left">
                    <th scope="col" className="px-4 py-3 font-semibold text-vx-silver">
                      {a.orders.columns.date}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-vx-silver">
                      {a.orders.columns.customer}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-vx-silver">
                      {a.orders.columns.item}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-vx-silver"
                    >
                      {a.orders.columns.amount}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-vx-silver"
                    >
                      {a.orders.columns.status}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-[rgba(14,165,233,0.10)]">
                      <td className="px-4 py-3 text-vx-muted">{fmtDate(o.createdAt)}</td>
                      <td className="px-4 py-3 text-vx-silver">{o.customerEmail}</td>
                      <th scope="row" className="px-4 py-3 text-left font-medium text-vx-ink">
                        {o.itemName}
                        <span className="mt-0.5 block text-xs font-normal text-vx-silver-dim">
                          {t.orders.types[o.orderType as keyof typeof t.orders.types] ??
                            o.orderType}
                        </span>
                      </th>
                      <td className="px-4 py-3 text-right font-mono text-vx-ink">
                        {formatCents(o.total)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wide ${
                            o.status === "paid"
                              ? "border-vx-cyan/40 text-vx-cyan"
                              : o.status === "failed" || o.status === "canceled"
                                ? "border-red-500/40 text-red-400"
                                : "border-[rgba(14,165,233,0.25)] text-vx-silver"
                          }`}
                        >
                          {t.orders.status[o.status as keyof typeof t.orders.status] ??
                            o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : null}

      {/* ---- System ---- */}
      {tab === "system" ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <GlowCard className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-vx-ink">
              <Mail size={16} className="text-vx-blue" aria-hidden />
              {a.system.emailQueue}
            </h3>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-vx-muted">{a.system.emailSent}</dt>
                <dd className="font-mono text-vx-cyan">{system.emailSent}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-vx-muted">{a.system.emailPending}</dt>
                <dd className="font-mono text-vx-silver">{system.emailPending}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-vx-muted">{a.system.emailAbandoned}</dt>
                <dd
                  className={`font-mono ${system.emailAbandoned > 0 ? "text-red-400" : "text-vx-silver-dim"}`}
                >
                  {system.emailAbandoned}
                </dd>
              </div>
            </dl>
          </GlowCard>

          <GlowCard className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-vx-ink">
              <Clock size={16} className="text-vx-blue" aria-hidden />
              {a.system.cronTitle}
            </h3>
            {system.cronRuns.length === 0 ? (
              <p className="mt-4 text-sm text-vx-muted">{a.system.cronNever}</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {system.cronRuns.map((run) => (
                  <li
                    key={`${run.job}-${run.createdAt}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="font-mono text-xs text-vx-silver">{run.job}</span>
                    <span
                      className={
                        run.status === "ok" ? "text-vx-cyan" : "text-red-400"
                      }
                    >
                      {run.status} · {fmtDate(run.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </GlowCard>

          <GlowCard className="p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold text-vx-ink">{a.system.title}</h3>
            {system.missingConfig.length === 0 ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-vx-cyan">
                <ShieldCheck size={15} aria-hidden />
                {a.system.allGood}
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {system.missingConfig.map((name) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 text-sm text-amber-400"
                  >
                    <AlertTriangle size={14} aria-hidden />
                    <span className="font-mono">{name}</span> — {a.system.missing}
                  </li>
                ))}
              </ul>
            )}
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-vx-blue underline-offset-4 hover:underline"
            >
              {a.system.healthLink}
            </a>
          </GlowCard>
        </div>
      ) : null}
    </div>
  );
}
