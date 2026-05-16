"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useOrders, useExecuteOrder } from "@/lib/hooks/use-orders";
import { RiskBadge } from "@/components/shared/risk-badge";
import { MoneyAmount } from "@/components/shared/money-amount";
import { formatTokens, formatMXN, formatDateTime } from "@/lib/format";
import { DEFAULT_ADDRESS, mockCompanies } from "@/lib/mocks/seed";
import { SellModal } from "../portafolio/sell-modal";
import { mockHoldings } from "@/lib/mocks/seed";

const COMPANY_FILTERS = [
  { id: undefined, label: "Todas" },
  ...mockCompanies.map((c) => ({ id: c.id, label: c.name })),
];

export default function MarketplacePage() {
  const { address } = useAccount();
  const effectiveAddress = address ?? DEFAULT_ADDRESS;
  const [activeCompany, setActiveCompany] = useState<string | undefined>(undefined);
  const [showSell, setShowSell] = useState(false);
  const { data: orders = [], isLoading } = useOrders(activeCompany);
  const { mutate: executeOrder, isPending: isExecuting } = useExecuteOrder();

  const defaultHolding = mockHoldings[DEFAULT_ADDRESS]?.[0];

  function handleBuy(orderId: string) {
    executeOrder({ orderId, buyer: effectiveAddress });
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">Marketplace</h1>
            <p className="text-sm text-foreground-subtle mt-0.5">
              {orders.length} órdenes activas
            </p>
          </div>
          <button
            onClick={() => setShowSell(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Vender tokens
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {COMPANY_FILTERS.map(({ id, label }) => (
            <button
              key={label}
              onClick={() => setActiveCompany(id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCompany === id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Orders table */}
        {isLoading ? (
          <p className="text-sm text-foreground-subtle">Cargando órdenes...</p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Startup</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle">Tipo</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle">Tokens</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle">Precio/token</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle">Total</th>
                  <th className="px-4 py-3 text-xs font-medium text-foreground-subtle">Risk</th>
                  <th className="px-4 py-3 text-xs font-medium text-foreground-subtle">Fecha</th>
                  <th className="px-4 py-3 text-xs font-medium text-foreground-subtle">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface-elevated">
                {orders.map((order) => {
                  const blocked = order.status === "blocked";
                  const filled = order.status === "filled";
                  return (
                    <tr
                      key={order.orderId}
                      className={`hover:bg-surface transition-colors ${
                        blocked ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={order.company.logoUrl}
                            alt={order.company.name}
                            className="h-6 w-6 rounded"
                          />
                          <span className="font-medium text-foreground">{order.company.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${
                          blocked
                            ? "bg-danger/10 text-danger"
                            : filled
                            ? "bg-success/10 text-success"
                            : "bg-accent/10 text-accent"
                        }`}>
                          {blocked ? "Bloqueado" : filled ? "Completado" : "Venta"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular text-foreground">
                        {formatTokens(order.tokensForSale)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <MoneyAmount amount={order.pricePerTokenMXN} className="text-foreground" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <MoneyAmount amount={order.totalMXN} className="font-semibold text-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        {order.wavyScorePreview !== undefined && (
                          <RiskBadge score={order.wavyScorePreview} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-foreground-subtle">
                          {formatDateTime(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {!blocked && !filled && (
                          <button
                            onClick={() => handleBuy(order.orderId)}
                            disabled={isExecuting}
                            className="inline-flex items-center rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-50"
                          >
                            Comprar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showSell && defaultHolding && (
        <SellModal holding={defaultHolding} onClose={() => setShowSell(false)} />
      )}
    </>
  );
}
