"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Holding } from "@/lib/types";
import { useCreateOrder } from "@/lib/hooks/use-orders";
import { DEFAULT_ADDRESS } from "@/lib/mocks/seed";
import { formatMXN, formatTokens } from "@/lib/format";

interface Props {
  holding: Holding;
  onClose: () => void;
}

export function SellModal({ holding, onClose }: Props) {
  const { address } = useAccount();
  const effectiveAddress = address ?? DEFAULT_ADDRESS;
  const { mutate: createOrder, isPending } = useCreateOrder();

  const [tokens, setTokens] = useState("");
  const [price, setPrice] = useState(String(holding.company.lastTradePriceMXN));
  const [wavyReady, setWavyReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWavyReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  const tokensNum = parseInt(tokens) || 0;
  const priceNum = parseFloat(price) || 0;
  const total = tokensNum * priceNum;

  function handleSubmit() {
    if (!tokensNum || !priceNum) return;
    createOrder(
      {
        input: {
          companyId: holding.companyId,
          tokensForSale: BigInt(tokensNum),
          pricePerTokenMXN: priceNum,
        },
        seller: effectiveAddress,
      },
      { onSuccess: onClose }
    );
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[480px] bg-surface-elevated border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-semibold">
            Vender {holding.company.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-xs text-foreground-muted mb-1.5 block">
              Cantidad a vender
            </Label>
            <Input
              type="number"
              placeholder="Ej. 100"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              className="bg-surface border-border"
            />
            <p className="text-[10px] text-foreground-subtle mt-1">
              Máximo disponible: {formatTokens(holding.tokensOwned)} tokens
            </p>
          </div>

          <div>
            <Label className="text-xs text-foreground-muted mb-1.5 block">
              Precio por token (MXN)
            </Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-surface border-border"
            />
            <p className="text-xs font-mono text-foreground-subtle mt-1">
              Precio sugerido {formatMXN(holding.company.lastTradePriceMXN)}
            </p>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-foreground-muted">Total estimado</span>
            <span className="font-mono font-semibold text-foreground">
              {total > 0 ? formatMXN(total) : "—"}
            </span>
          </div>

          {/* Compliance block — fades in after Wavy check (800ms) */}
          <div
            className="rounded-lg border-l-2 p-3 flex gap-2.5 transition-all duration-500"
            style={{
              borderLeftColor: wavyReady ? "var(--color-success)" : "var(--color-accent)",
              background: wavyReady ? "rgba(117,169,78,0.06)" : "rgba(var(--color-accent),0.05)",
            }}
          >
            {wavyReady ? (
              <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
            ) : (
              <Loader2 className="h-4 w-4 text-accent shrink-0 mt-0.5 animate-spin" />
            )}
            <p className="text-xs text-foreground-muted leading-relaxed transition-colors duration-300">
              {wavyReady ? (
                <>
                  <strong className="text-success">Wavy Node listo.</strong> La contraparte
                  será verificada al ejecutar. Score inferior a 60 bloquea la transacción
                  automáticamente.
                </>
              ) : (
                <>Conectando con <strong>Wavy Node</strong>…</>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !tokensNum || !priceNum}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {isPending ? "Publicando..." : "Publicar orden"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
