"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useOrders, useExecuteOrder } from "@/lib/hooks/use-orders";
import { RiskBadge } from "@/components/shared/risk-badge";
import { MoneyAmount } from "@/components/shared/money-amount";
import { formatTokens, formatMXN, formatDateTime } from "@/lib/format";
import { DEFAULT_ADDRESS, mockCompanies } from "@/lib/mocks/seed";
import { SellModal } from "../portafolio/sell-modal";
import { mockHoldings } from "@/lib/mocks/seed";
import type { Order } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const COMPANY_FILTERS = [
  { id: undefined, label: "Todas" },
  ...mockCompanies.map((c) => ({ id: c.id, label: c.name })),
];

// ── Buy confirmation modal ────────────────────────────────────────────────────

function BuyConfirmModal({
  order,
  onConfirm,
  onCancel,
  isPending,
}: {
  order: Order;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [wavyReady, setWavyReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWavyReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  const score = order.wavyScorePreview ?? 88;

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-[440px] bg-surface-elevated border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-semibold">
            Confirmar compra · {order.company.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {/* Order summary */}
          <div className="rounded-lg border border-border bg-surface p-3 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Tokens</span>
              <span className="font-mono font-medium text-foreground">
                {formatTokens(order.tokensForSale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Precio / token</span>
              <span className="font-mono text-foreground">
                {formatMXN(order.pricePerTokenMXN)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-medium text-foreground">Total</span>
              <span className="font-mono font-semibold text-foreground">
                {formatMXN(order.totalMXN)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-foreground-subtle">Vendedor</span>
              <span className="font-mono text-foreground-subtle">
                {order.sellerName ?? `${order.seller.slice(0, 6)}…${order.seller.slice(-4)}`}
              </span>
            </div>
          </div>

          {/* Wavy check — animates in after 900ms */}
          <div
            className="rounded-lg border-l-2 p-3 flex gap-2.5 transition-all duration-500"
            style={{
              borderLeftColor: wavyReady ? "var(--color-success)" : "var(--color-accent)",
              background: wavyReady ? "rgba(117,169,78,0.06)" : "rgba(var(--color-accent),0.05)",
              opacity: 1,
            }}
          >
            {wavyReady ? (
              <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
            ) : (
              <Loader2 className="h-4 w-4 text-accent shrink-0 mt-0.5 animate-spin" />
            )}
            <div className="flex-1 min-w-0">
              {wavyReady ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-success">
                      Wavy Node — Contraparte aprobada
                    </p>
                    <RiskBadge score={score} />
                  </div>
                  <p className="text-xs text-foreground-muted">
                    KYC verificado · Sin alertas AML · Score {score}/100
                  </p>
                </div>
              ) : (
                <p className="text-xs text-foreground-muted">
                  Verificando contraparte con Wavy Node…
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!wavyReady || isPending}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Ejecutando…
              </span>
            ) : (
              "Confirmar compra"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const { address } = useAccount();
  const effectiveAddress = address ?? DEFAULT_ADDRESS;
  const [activeCompany, setActiveCompany] = useState<string | undefined>(undefined);
  const [showSell, setShowSell] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState<Order | null>(null);
  const { data: orders = [], isLoading } = useOrders(activeCompany);
  const { mutate: executeOrder, isPending: isExecuting } = useExecuteOrder();

  const defaultHolding = mockHoldings[DEFAULT_ADDRESS]?.[0];

  function handleBuy(order: Order) {
    setConfirmOrder(order);
  }

  function handleConfirm() {
    if (!confirmOrder) return;
    executeOrder(
      { orderId: confirmOrder.orderId, buyer: effectiveAddress },
      { onSuccess: () => setConfirmOrder(null) }
    );
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
                            onClick={() => handleBuy(order)}
                            className="inline-flex items-center rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
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

      {confirmOrder && (
        <BuyConfirmModal
          order={confirmOrder}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmOrder(null)}
          isPending={isExecuting}
        />
      )}
    </>
  );
}
