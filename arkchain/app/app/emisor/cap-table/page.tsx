"use client";

import { useState } from "react";
import { useCapTable, useCorporateEvents, useCompanyStats } from "@/lib/hooks/use-captable";
import { useOrders } from "@/lib/hooks/use-orders";
import { formatTokens, formatMXN, formatDate } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MoneyAmount } from "@/components/shared/money-amount";
import { Building2, Plus } from "lucide-react";

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
  retail: "Minoristas (Arkangeles)",
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

      {/* Cap table visualization */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* Stacked bar chart (60%) */}
        <div className="md:col-span-3 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Distribución de tokens</h2>
          <div className="flex h-10 rounded-md overflow-hidden mb-4">
            {capTable.map((entry) => (
              <div
                key={entry.holder}
                className={`${CATEGORY_COLORS[entry.category]} transition-all hover:opacity-80`}
                style={{ width: `${entry.pctOwnership}%` }}
                title={`${CATEGORY_LABELS[entry.category]}: ${entry.pctOwnership}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {capTable.map((entry) => (
              <div key={entry.holder} className="flex items-center gap-1.5 text-xs">
                <span className={`h-2.5 w-2.5 rounded-sm ${CATEGORY_COLORS[entry.category]}`} />
                <span className="text-foreground-muted">{CATEGORY_LABELS[entry.category]}</span>
                <span className="font-mono text-foreground">{entry.pctOwnership}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top holders list (40%) */}
        <div className="md:col-span-2 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Top holders</h2>
          <div className="space-y-2">
            {capTable.map((entry) => (
              <div key={entry.holder} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="h-3 w-3 text-foreground-subtle shrink-0" />
                  <span className="text-foreground truncate">{entry.holderName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="font-mono text-foreground-subtle">{formatTokens(entry.tokens)}</span>
                  <span className="font-mono font-semibold text-foreground w-10 text-right">{entry.pctOwnership}%</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-accent hover:underline">
            Ver los {stats?.activeHolders ?? 87} holders →
          </button>
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
