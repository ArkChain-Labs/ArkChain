"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ArrowUpRight, ArrowDownRight, Calendar, ShoppingCart } from "lucide-react";
import { usePortfolio } from "@/lib/hooks/use-portfolio";
import { DEFAULT_ADDRESS } from "@/lib/mocks/seed";
import { EncryptedValue } from "@/components/shared/encrypted-value";
import { TokenAmount } from "@/components/shared/token-amount";
import { MoneyAmount } from "@/components/shared/money-amount";
import { formatMXN, formatDateTime } from "@/lib/format";
import { SellModal } from "./sell-modal";
import { Holding } from "@/lib/types";

export default function PortafolioPage() {
  const { address } = useAccount();
  const effectiveAddress = address ?? DEFAULT_ADDRESS;
  const { data: holdings = [], isLoading } = usePortfolio(effectiveAddress);
  const [sellHolding, setSellHolding] = useState<Holding | null>(null);

  const totalValue = holdings.reduce((s, h) => s + h.estimatedValueMXN, 0);

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Mi portafolio
          </h1>
          <p className="text-sm text-foreground-subtle mt-0.5">
            {holdings.length} posiciones activas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-foreground-subtle mb-1">Valor estimado</p>
            <div className="flex items-center gap-1">
              <EncryptedValue
                value={formatMXN(totalValue)}
                className="text-base font-semibold"
              />
            </div>
            <p className="text-[10px] text-foreground-subtle mt-1">Solo tú ves este valor</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-foreground-subtle mb-1">Posiciones</p>
            <p className="text-xl font-mono font-semibold tabular text-foreground">{holdings.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-foreground-subtle mb-1">Volumen 30d</p>
            <MoneyAmount amount={45_000} className="text-base font-semibold" />
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-foreground-subtle mb-1">Próximo evento</p>
            <p className="text-sm font-medium text-foreground">FintechMX</p>
            <p className="text-xs text-foreground-subtle">Asamblea · 12 jun</p>
          </div>
        </div>

        {/* Holdings table */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Posiciones</h2>
          {isLoading ? (
            <div className="text-sm text-foreground-subtle">Cargando...</div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Startup</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle">Tokens</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle">Valor estimado</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle">Var. 30d</th>
                    <th className="px-4 py-3 text-xs font-medium text-foreground-subtle">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface-elevated">
                  {holdings.map((h) => (
                    <tr key={h.companyId} className="hover:bg-surface transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={h.company.logoUrl}
                            alt={h.company.name}
                            className="h-7 w-7 rounded-md"
                          />
                          <div>
                            <p className="font-medium text-foreground">{h.company.name}</p>
                            <p className="text-xs text-foreground-subtle">{h.company.sector}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <TokenAmount tokens={h.tokensOwned} encrypted={h.encrypted} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <EncryptedValue value={formatMXN(h.estimatedValueMXN)} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`flex items-center justify-end gap-0.5 font-mono text-xs ${
                            h.pnl30dPct >= 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          {h.pnl30dPct >= 0 ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                          {Math.abs(h.pnl30dPct).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSellHolding(h)}
                            className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            Vender
                          </button>
                          <button className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface transition-colors">
                            Detalle
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent events */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Eventos recientes</h2>
          <div className="space-y-2">
            {[
              { date: Date.now() - 86400000, label: "Actualización de valuación · FintechMX · $45M USD" },
              { date: Date.now() - 15 * 86400000, label: "Dividendo Q4 2025 · FintechMX · $0.18 MXN/token" },
              { date: Date.now() - 30 * 86400000, label: "Trade ejecutado · 200 tokens LogiPay · $82,400 MXN" },
              { date: Date.now() - 45 * 86400000, label: "Auditoría anual completada · FintechMX · Deloitte" },
            ].map(({ date, label }) => (
              <div key={date} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                <div className="flex-1 flex justify-between gap-4">
                  <span className="text-foreground-muted">{label}</span>
                  <span className="font-mono text-xs text-foreground-subtle whitespace-nowrap">
                    {formatDateTime(date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sellHolding && (
        <SellModal holding={sellHolding} onClose={() => setSellHolding(null)} />
      )}
    </>
  );
}
