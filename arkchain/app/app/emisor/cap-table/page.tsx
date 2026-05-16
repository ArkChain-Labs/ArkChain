"use client";

import { useCapTable, useCorporateEvents, useCompanyStats } from "@/lib/hooks/use-captable";
import { useOrders } from "@/lib/hooks/use-orders";
import { formatTokens, formatMXN, formatDate } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoneyAmount } from "@/components/shared/money-amount";
import { Building2, Plus, Users } from "lucide-react";


const COMPANY_ID = "fintechmx";

const CATEGORY_COLORS: Record<string, string> = {
  founder: "bg-primary",
  vc: "bg-accent",
  retail: "bg-success",
  reserve: "bg-warning",
  treasury: "bg-encrypted",
};

const CATEGORY_LABELS: Record<string, string> = {
  founder: "Fundadores",
  vc: "VC Institucional",
  retail: "Minoristas",
  reserve: "Reserva",
  treasury: "Treasury",
};

const EVENT_STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};
const EVENT_STATUS_LABELS: Record<string, string> = {
  upcoming: "Próximo",
  completed: "Completado",
  cancelled: "Cancelado",
};

export default function CapTablePage() {
  const { data: capTable = [] } = useCapTable(COMPANY_ID);
  const { data: events = [] } = useCorporateEvents(COMPANY_ID);
  const { data: stats } = useCompanyStats(COMPANY_ID);
  const { data: trades = [] } = useOrders(COMPANY_ID);

  // Aggregate percentages per category for the legend (avoids 14 "Minoristas" duplicates)
  const categoryTotals = capTable.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.pctOwnership;
    return acc;
  }, {});
  const uniqueCategories = Object.entries(categoryTotals) as [string, number][];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb-style header */}
      <div>
        <p className="text-xs text-foreground-subtle mb-1">Mis startups / FintechMX</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-foreground">Cap Table</h1>
            <span className="inline-flex items-center rounded-sm border border-accent/30 bg-accent/8 px-2 py-0.5 text-xs font-medium text-accent">
              Privado · Solo emisor + auditor
            </span>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-surface transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Nuevo evento
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
              Emitir tokens
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-foreground-subtle mb-1">Tokens emitidos</p>
          <p className="font-mono tabular text-lg font-semibold text-foreground">
            {stats ? formatTokens(stats.totalSupply) : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-foreground-subtle mb-1">Holders activos</p>
          <p className="font-mono tabular text-lg font-semibold text-foreground">
            {stats?.activeHolders ?? "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-foreground-subtle mb-1">Volumen secundario 30d</p>
          {stats && <MoneyAmount amount={stats.volume30dMXN} className="text-lg font-semibold" />}
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-foreground-subtle mb-1">Precio prom. mes</p>
          {stats && (
            <p className="font-mono tabular text-lg font-semibold text-foreground">
              {formatMXN(stats.avgPriceMonthMXN)} / TKN
            </p>
          )}
        </div>
      </div>

      {/* Distribution bar */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Distribución de tokens</h2>
        {/* Stacked bar — one segment per entry (small retail slivers visible on hover) */}
        <div className="flex h-10 rounded-md overflow-hidden mb-4">
          {capTable.map((entry) => (
            <div
              key={entry.holder}
              className={`${CATEGORY_COLORS[entry.category]} transition-all hover:opacity-75`}
              style={{ width: `${entry.pctOwnership}%` }}
              title={`${entry.holderName}: ${entry.pctOwnership}%`}
            />
          ))}
        </div>
        {/* Legend — deduplicated by category with aggregate % */}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {uniqueCategories.map(([cat, total]) => (
            <div key={cat} className="flex items-center gap-1.5 text-xs">
              <span className={`h-2.5 w-2.5 rounded-sm ${CATEGORY_COLORS[cat]}`} />
              <span className="text-foreground-muted">{CATEGORY_LABELS[cat]}</span>
              <span className="font-mono text-foreground">{total.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full investor table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-surface px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-foreground-subtle" />
            <p className="text-sm font-semibold text-foreground">
              Todos los inversionistas
            </p>
          </div>
          <span className="text-xs text-foreground-subtle font-mono">
            {capTable.length} registrados
          </span>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-surface border-b border-border">
              <tr>
                <th className="text-left px-5 py-2.5 font-semibold text-foreground-subtle uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-2.5 font-semibold text-foreground-subtle uppercase tracking-wider">Nombre</th>
                <th className="text-left px-5 py-2.5 font-semibold text-foreground-subtle uppercase tracking-wider">Categoría</th>
                <th className="text-right px-5 py-2.5 font-semibold text-foreground-subtle uppercase tracking-wider">Tokens</th>
                <th className="text-right px-5 py-2.5 font-semibold text-foreground-subtle uppercase tracking-wider">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {capTable.map((entry, idx) => (
                <tr
                  key={entry.holder}
                  className={`hover:bg-surface transition-colors ${idx % 2 === 0 ? "bg-surface-elevated" : "bg-surface"}`}
                >
                  <td className="px-5 py-2.5 font-mono text-foreground-subtle">{idx + 1}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3 w-3 text-foreground-subtle shrink-0" />
                      <span className="text-foreground font-medium">{entry.holderName}</span>
                    </div>
                    <p className="font-mono text-foreground-subtle text-[10px] mt-0.5 ml-5">
                      {entry.holder.slice(0, 8)}…{entry.holder.slice(-6)}
                    </p>
                  </td>
                  <td className="px-5 py-2.5">
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-medium ${
                        entry.category === "founder" ? "bg-primary/10 text-primary" :
                        entry.category === "vc"      ? "bg-accent/10 text-accent" :
                        entry.category === "retail"  ? "bg-success/10 text-success" :
                        entry.category === "reserve" ? "bg-warning/10 text-warning" :
                                                       "bg-encrypted/10 text-encrypted"
                      }`}
                    >
                      {CATEGORY_LABELS[entry.category]}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right font-mono tabular text-foreground">
                    {formatTokens(entry.tokens)}
                  </td>
                  <td className="px-5 py-2.5 text-right font-mono font-semibold text-foreground">
                    {entry.pctOwnership}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="eventos">
        <TabsList className="bg-surface border border-border">
          <TabsTrigger value="eventos">Eventos corporativos</TabsTrigger>
          <TabsTrigger value="trades">Trades secundarios</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="eventos" className="mt-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Fecha</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Detalle</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface-elevated">
                {events.map((ev) => (
                  <tr key={ev.eventId} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-foreground-subtle whitespace-nowrap">
                      {formatDate(ev.date)}
                    </td>
                    <td className="px-4 py-3 text-foreground capitalize">{ev.type}</td>
                    <td className="px-4 py-3 text-foreground-muted max-w-xs truncate">{ev.detail}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${EVENT_STATUS_STYLES[ev.status]}`}>
                        {EVENT_STATUS_LABELS[ev.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="mt-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Startup</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle">Tokens</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle">Total MXN</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface-elevated">
                {trades.slice(0, 8).map((o) => (
                  <tr key={o.orderId} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{o.company.name}</td>
                    <td className="px-4 py-3 text-right font-mono tabular text-foreground">{formatTokens(o.tokensForSale)}</td>
                    <td className="px-4 py-3 text-right"><MoneyAmount amount={o.totalMXN} /></td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground-subtle capitalize">{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="reportes" className="mt-4">
          <div className="rounded-lg border border-border bg-surface p-6 text-center">
            <p className="text-foreground-muted text-sm">
              Los reportes detallados están disponibles para reguladores.{" "}
              <span className="text-accent cursor-pointer hover:underline">Contactar CNBV →</span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
