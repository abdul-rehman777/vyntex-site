"use client";

import { useLang } from "@/context/LanguageContext";
import { formatCents } from "@/lib/order-types";
import GlowCard from "@/components/ui/GlowCard";

export interface OrderRowView {
  id: string;
  createdAt: string;
  orderType: string;
  status: string;
  total: number;
  clientReference: string | null;
  itemName: string;
  qualifying?: boolean;
}

/**
 * Renders a partner's or client's orders. Status text comes straight from the
 * database — a 'pending' order says "awaiting payment", never "paid", because
 * only the verified Square webhook can change that value.
 */
export default function OrdersList({ orders }: { orders: OrderRowView[] }) {
  const { t, lang } = useLang();
  const o = t.orders;

  if (orders.length === 0) {
    return (
      <GlowCard className="p-8 text-center">
        <p className="text-sm text-vx-muted">{o.empty}</p>
      </GlowCard>
    );
  }

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusLabel = (status: string) =>
    o.status[status as keyof typeof o.status] ?? status;

  const typeLabel = (type: string) =>
    o.types[type as keyof typeof o.types] ?? type;

  const statusTone = (status: string) => {
    if (status === "paid") return "border-vx-cyan/40 text-vx-cyan";
    if (status === "failed" || status === "canceled") return "border-red-500/40 text-red-400";
    if (status === "refunded") return "border-amber-500/40 text-amber-400";
    return "border-[rgba(14,165,233,0.25)] text-vx-silver";
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[rgba(14,165,233,0.14)] md:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{o.title}</caption>
          <thead>
            <tr className="bg-vx-bg2 text-left">
              <th scope="col" className="px-4 py-3 font-semibold text-vx-silver">
                {o.columns.date}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-vx-silver">
                {o.columns.order}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-vx-silver">
                {o.columns.reference}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-vx-silver">
                {o.columns.amount}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-vx-silver">
                {o.columns.status}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-[rgba(14,165,233,0.10)]">
                <td className="px-4 py-3 text-vx-muted">{dateFmt(order.createdAt)}</td>
                <th scope="row" className="px-4 py-3 text-left font-medium text-vx-ink">
                  {order.itemName}
                  <span className="mt-0.5 block text-xs font-normal text-vx-silver-dim">
                    {typeLabel(order.orderType)}
                  </span>
                </th>
                <td className="px-4 py-3 text-vx-muted">
                  {order.clientReference ?? "—"}
                  {order.qualifying ? (
                    <span className="mt-0.5 block text-xs text-vx-cyan">
                      {o.qualifying}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right font-mono text-vx-ink">
                  {formatCents(order.total)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wide ${statusTone(order.status)}`}
                  >
                    {statusLabel(order.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-vx-ink">{order.itemName}</p>
                <p className="mt-0.5 text-xs text-vx-silver-dim">
                  {typeLabel(order.orderType)} · {dateFmt(order.createdAt)}
                </p>
              </div>
              <p className="shrink-0 font-mono font-semibold text-vx-ink">
                {formatCents(order.total)}
              </p>
            </div>

            {order.clientReference ? (
              <p className="mt-2 text-sm text-vx-muted">{order.clientReference}</p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-block rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wide ${statusTone(order.status)}`}
              >
                {statusLabel(order.status)}
              </span>
              {order.qualifying ? (
                <span className="text-xs text-vx-cyan">{o.qualifying}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
