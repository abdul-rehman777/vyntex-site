"use client";

import { Lock } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { LABOR_TERMS } from "@/lib/pricing";
import GlowCard from "@/components/ui/GlowCard";
import type {
  WholesaleGroupView,
  WholesaleRowView,
} from "@/components/reseller/wholesale-view";

/**
 * CONFIDENTIAL. Renders wholesale rows that the SERVER already decided this
 * user is allowed to see.
 *
 * Note what this component does NOT do: it does not import
 * lib/pricing-reseller.ts, and it could not if it tried — that module is
 * `server-only` and importing it from here would fail the build. The figures
 * arrive as props, which means they exist only in the response to an
 * authorized request and never in a downloadable JS chunk.
 */
export default function WholesaleLibrary({
  groups,
}: {
  groups: WholesaleGroupView[];
}) {
  const { t } = useLang();
  const w = t.wholesale;

  return (
    <section aria-labelledby="wholesale-heading" className="flex flex-col gap-6">
      {/* Confidentiality banner — states the obligation, does not merely imply it. */}
      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/5 px-4 py-3"
      >
        <Lock size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden />
        <p className="text-sm font-medium text-amber-300">{w.confidentialBanner}</p>
      </div>

      <div>
        <h2 id="wholesale-heading" className="text-xl font-bold text-vx-ink">
          {w.title}
        </h2>
        <p className="mt-1 text-sm text-vx-muted">{w.subtitle}</p>
      </div>

      {groups.map((group) => (
        <div key={group.category} className="flex flex-col gap-3">
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-vx-blue">
            {t.pricing.tabs[group.category]}
          </h3>

          {/* Desktop: table. Mobile: stacked cards. Same data, no horizontal scroll. */}
          <div className="hidden overflow-hidden rounded-2xl border border-[rgba(14,165,233,0.14)] md:block">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                {t.pricing.tabs[group.category]} — {w.title}
              </caption>
              <thead>
                <tr className="bg-vx-bg2 text-left">
                  <th scope="col" className="px-4 py-3 font-semibold text-vx-silver">
                    {w.columns.service}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold text-vx-silver">
                    {w.columns.partnerCost}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold text-vx-silver">
                    {w.columns.suggestedRetail}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold text-vx-silver">
                    {w.columns.partnerMargin}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold text-vx-silver">
                    {w.columns.maintenanceCost}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold text-vx-silver">
                    {w.columns.maintenanceRetail}
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => (
                  <TierRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {group.rows.map((row) => (
              <TierCard key={row.id} row={row} />
            ))}
          </div>
        </div>
      ))}

      {/* What's included / what isn't — the agreement's §4 obligations, restated. */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold text-vx-ink">{w.includedHeading}</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {w.included.map((line) => (
              <li key={line} className="text-sm text-vx-muted">
                {line
                  .replace("{hourly}", LABOR_TERMS.hourly)
                  .replace("{rush}", LABOR_TERMS.rush)}
              </li>
            ))}
          </ul>
        </GlowCard>

        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold text-vx-ink">{w.thirdPartyHeading}</h3>
          <p className="mt-3 text-sm text-vx-muted">{w.thirdParty}</p>
          <p className="mt-3 border-t border-[rgba(14,165,233,0.12)] pt-3 text-sm font-medium text-amber-300">
            {w.noUndercutting}
          </p>
        </GlowCard>
      </div>
    </section>
  );
}

/** Shared cell derivation so the table and the card can never disagree. */
function useRowLines(row: WholesaleRowView) {
  const { t } = useLang();
  const w = t.wholesale;

  const nameKey = row.nameKey as keyof typeof t.pricing.items;
  const suffix = row.hasSetup ? ` ${w.setup}` : "";

  return {
    name: t.pricing.items[nameKey].name,
    cost: `${row.cost}${suffix}`,
    resale: `${row.resale}${suffix}`,
    profit: `${row.profit}${suffix}`,
    maintenanceCost: row.maintenanceCost
      ? `${row.maintenanceCost}${w.perMonth}`
      : null,
    maintenanceResale: row.maintenanceResale
      ? `${row.maintenanceResale}${w.perMonth}`
      : null,
    quotedNote: w.quoteOnly,
    dash: "—",
  };
}

function TierRow({ row }: { row: WholesaleRowView }) {
  const lines = useRowLines(row);

  return (
    <tr className="border-t border-[rgba(14,165,233,0.10)]">
      <th scope="row" className="px-4 py-3 text-left font-medium text-vx-ink">
        {lines.name}
        {row.quoteOnly ? (
          <span className="mt-0.5 block text-xs font-normal text-vx-silver-dim">
            {lines.quotedNote}
          </span>
        ) : null}
      </th>
      <td className="px-4 py-3 text-right font-mono text-vx-cyan">{lines.cost}</td>
      <td className="px-4 py-3 text-right font-mono text-vx-silver">{lines.resale}</td>
      <td className="px-4 py-3 text-right font-mono font-semibold text-vx-ink">
        {lines.profit}
      </td>
      <td className="px-4 py-3 text-right font-mono text-vx-muted">
        {lines.maintenanceCost ?? lines.dash}
      </td>
      <td className="px-4 py-3 text-right font-mono text-vx-muted">
        {lines.maintenanceResale ?? lines.dash}
      </td>
    </tr>
  );
}

function TierCard({ row }: { row: WholesaleRowView }) {
  const { t } = useLang();
  const w = t.wholesale;
  const lines = useRowLines(row);

  return (
    <div className="rounded-2xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2 p-4">
      <h4 className="font-semibold text-vx-ink">{lines.name}</h4>
      {row.quoteOnly ? (
        <p className="mt-1 text-xs text-vx-silver-dim">{lines.quotedNote}</p>
      ) : null}

      <dl className="mt-3 flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-vx-muted">{w.columns.partnerCost}</dt>
          <dd className="font-mono text-vx-cyan">{lines.cost}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-vx-muted">{w.columns.suggestedRetail}</dt>
          <dd className="font-mono text-vx-silver">{lines.resale}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-[rgba(14,165,233,0.10)] pt-1.5">
          <dt className="text-vx-muted">{w.columns.partnerMargin}</dt>
          <dd className="font-mono font-semibold text-vx-ink">{lines.profit}</dd>
        </div>
        {lines.maintenanceCost ? (
          <>
            <div className="flex justify-between gap-3 border-t border-[rgba(14,165,233,0.10)] pt-1.5">
              <dt className="text-vx-muted">{w.columns.maintenanceCost}</dt>
              <dd className="font-mono text-vx-cyan">{lines.maintenanceCost}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-vx-muted">{w.columns.maintenanceRetail}</dt>
              <dd className="font-mono text-vx-silver">{lines.maintenanceResale}</dd>
            </div>
          </>
        ) : null}
      </dl>
    </div>
  );
}
