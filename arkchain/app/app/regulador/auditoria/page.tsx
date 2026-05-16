"use client";

import { useState, useEffect, Fragment } from "react";
import {
  ShieldCheck,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useAuditEvents } from "@/lib/hooks/use-audit";
import { AuditorRow } from "@/components/shared/auditor-row";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EncryptedValue } from "@/components/shared/encrypted-value";
import { MoneyAmount } from "@/components/shared/money-amount";
import { formatAddress, formatDateTime, formatMXN } from "@/lib/format";
import { AuditEvent } from "@/lib/types";

// ── Auditor mode header ──────────────────────────────────────────────────────

function SyncTimestamp() {
  const [ts, setTs] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      setTs(
        new Intl.DateTimeFormat("es-MX", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    fmt();
    const id = setInterval(fmt, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span>{ts}</span>;
}

function AuditorModeHeader() {
  return (
    <div
      className="rounded-xl border px-6 py-5"
      style={{
        background: "linear-gradient(135deg, #3f0a0a 0%, #7f1d1d 100%)",
        borderColor: "#7f1d1d",
        boxShadow: "0 1px 12px 0 rgba(127,29,29,0.25)",
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-white"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  letterSpacing: "0.12em",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: "#fca5a5" }}
                />
                CNBV — Modo Auditor Activo
              </span>
            </div>
            <p className="mt-2 text-xs" style={{ color: "rgba(252,165,165,0.75)" }}>
              Acceso con llave de auditor eERC20 — Todos los balances descifrados
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1.5 justify-end mb-0.5">
            <RefreshCw className="h-3 w-3" style={{ color: "rgba(252,165,165,0.5)" }} />
            <p className="text-xs font-medium" style={{ color: "rgba(252,165,165,0.5)" }}>
              Última sincronización
            </p>
          </div>
          <p className="font-mono text-xs" style={{ color: "rgba(252,165,165,0.85)" }}>
            <SyncTimestamp />
          </p>
          <p className="mt-1 text-xs" style={{ color: "rgba(252,165,165,0.4)" }}>
            Fuji Testnet · Chain 43113
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Expanded row detail ──────────────────────────────────────────────────────

function ExpandedRow({ event }: { event: AuditEvent }) {
  return (
    <tr className="bg-surface">
      <td colSpan={9} className="px-4 py-4">
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="font-semibold text-foreground mb-2">Partes involucradas</p>
            <p className="text-foreground-muted">
              De: <span className="text-foreground font-medium">{event.fromName}</span>
            </p>
            <p className="font-mono text-foreground-subtle break-all">{event.from}</p>
            <p className="text-foreground-muted mt-1">
              A: <span className="text-foreground font-medium">{event.toName}</span>
            </p>
            <p className="font-mono text-foreground-subtle break-all">{event.to}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">Reporte Wavy Node</p>
            {event.wavyAllowed ? (
              <div className="space-y-1">
                <p className="text-success">✓ KYC verificado</p>
                <p className="text-success">✓ Sin alertas AML</p>
                <p className="text-success">✓ Historial limpio</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-danger">✗ Actividad inusual detectada</p>
                <p className="text-danger">✗ Revisión manual requerida</p>
                <p className="text-foreground-subtle">
                  Score: {event.wavyScore}/100 — umbral mínimo: 60
                </p>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">On-chain</p>
            <p className="text-foreground-muted">
              Bloque:{" "}
              <span className="font-mono text-foreground">{event.blockNumber.toLocaleString()}</span>
            </p>
            <a
              href={`https://testnet.snowtrace.io/tx/${event.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline mt-1"
            >
              <ExternalLink className="h-3 w-3" />
              Ver en Snowtrace
            </a>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const { data: events = [], isLoading } = useAuditEvents();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalVol = events
    .filter((e) => e.status === "executed")
    .reduce((s, e) => s + e.totalMXN, 0);
  const avgScore = events.length
    ? Math.round(events.reduce((s, e) => s + e.wavyScore, 0) / events.length)
    : 0;
  const blocked = events.filter((e) => e.status === "blocked").length;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* ── Step 1: Institutional CNBV header ── */}
      <AuditorModeHeader />

      {/* Page title + filters row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Auditoría — Mercado secundario
          </h1>
          <p className="text-sm text-foreground-subtle mt-0.5">
            Vista descifrada con llave de auditor. Todo acceso queda registrado en el ledger inmutable.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors shrink-0">
          Generar reporte trimestral
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Jurisdicción: México", active: true },
          { label: "Plataforma: Arkangeles", active: false },
          { label: "Periodo: Últimos 90d", active: false },
        ].map(({ label, active }) => (
          <button
            key={label}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
              active
                ? "border-foreground text-foreground bg-surface"
                : "border-border text-foreground-subtle hover:border-foreground-subtle"
            }`}
          >
            {label}
          </button>
        ))}
        <input
          type="text"
          placeholder="Buscar dirección 0x..."
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-mono outline-none focus:border-foreground-subtle transition-colors w-48"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Transacciones 90d", value: events.length.toString() },
          { label: "Volumen total", value: formatMXN(totalVol) },
          { label: "Risk score prom.", value: `${avgScore}/100`, color: "text-success" },
          { label: "Trades bloqueados", value: String(blocked), color: "text-danger" },
          { label: "Plataformas activas", value: "1 (Arkangeles)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-foreground-subtle mb-1">{label}</p>
            <p className={`text-lg font-semibold font-mono tabular-nums ${color ?? "text-foreground"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Main audit table */}
      {isLoading ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-sm text-foreground-subtle">Cargando eventos...</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-surface px-4 py-2.5 border-b border-border flex items-center justify-between">
            <p className="text-xs text-foreground-subtle">
              {events.length} transacciones · Vista descifrada con llave de auditor CNBV
            </p>
            <p className="text-xs font-mono text-foreground-subtle">
              Última exportación: 14 may 2026, 09:12, Aud-CNBV-03
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {[
                    "Timestamp",
                    "De",
                    "A",
                    "Startup",
                    "Tokens",
                    "Precio MXN",
                    "Total MXN",
                    "Wavy",
                    "TX Hash",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center">
                      <p className="text-sm text-foreground-subtle">
                        No hay transacciones registradas en este período.
                      </p>
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => {
                    const isBlocked = ev.status === "blocked";
                    const expanded = expandedId === ev.txHash;
                    return (
                      <Fragment key={ev.txHash}>
                        <AuditorRow highlighted={isBlocked} className="cursor-pointer">
                          <td
                            className="px-4 py-2.5 font-mono text-xs text-foreground-subtle whitespace-nowrap"
                            onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                          >
                            {formatDateTime(ev.timestamp)}
                          </td>
                          <td
                            className="px-4 py-2.5 text-xs"
                            onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                          >
                            <p className="font-medium text-foreground">{ev.fromName}</p>
                            <p className="font-mono text-foreground-subtle">
                              {formatAddress(ev.from)}
                            </p>
                          </td>
                          <td
                            className="px-4 py-2.5 text-xs"
                            onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                          >
                            <p className="font-medium text-foreground">{ev.toName}</p>
                            <p className="font-mono text-foreground-subtle">
                              {formatAddress(ev.to)}
                            </p>
                          </td>
                          <td
                            className="px-4 py-2.5"
                            onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                          >
                            <div className="flex items-center gap-1.5">
                              <img
                                src={ev.company.logoUrl}
                                alt={ev.company.name}
                                className="h-5 w-5 rounded"
                              />
                              <span className="text-xs font-medium text-foreground">
                                {ev.company.name}
                              </span>
                            </div>
                          </td>
                          <td
                            className="px-4 py-2.5 font-mono tabular-nums text-xs text-foreground"
                            onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                          >
                            {Number(ev.tokens).toLocaleString("es-MX")}
                          </td>
                          <td
                            className="px-4 py-2.5 font-mono tabular-nums text-xs text-foreground"
                            onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                          >
                            {formatMXN(ev.pricePerTokenMXN)}
                          </td>
                          <td
                            className="px-4 py-2.5"
                            onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                          >
                            <MoneyAmount amount={ev.totalMXN} className="font-semibold text-xs" />
                          </td>
                          <td
                            className="px-4 py-2.5"
                            onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                          >
                            <RiskBadge score={ev.wavyScore} />
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-foreground-subtle">
                                {ev.txHash.slice(0, 10)}…
                              </span>
                              <a
                                href={`https://testnet.snowtrace.io/tx/${ev.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3 text-foreground-subtle hover:text-accent transition-colors" />
                              </a>
                            </div>
                          </td>
                        </AuditorRow>
                        {expanded && <ExpandedRow event={ev} />}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparison section */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <p className="text-xs font-medium text-foreground-subtle uppercase tracking-widest mb-1">
          Demo
        </p>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Privado por defecto, auditable cuando importa
        </h2>
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div className="rounded-lg border border-border bg-surface-elevated p-4">
            <p className="text-xs font-medium text-foreground-subtle mb-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-encrypted inline-block" />
              Vista de inversionista
            </p>
            <div className="space-y-2 text-xs">
              {["FintechMX", "LogiPay"].map((name) => (
                <div key={name} className="flex justify-between p-2 rounded bg-surface">
                  <span className="text-foreground">{name}</span>
                  <EncryptedValue value="$294,000 MXN" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 text-foreground-subtle px-2">
            <div className="h-px w-8 bg-accent" />
            <span className="text-xs text-accent font-medium whitespace-nowrap">→</span>
            <div className="h-px w-8 bg-accent" />
          </div>

          <div className="rounded-lg border border-accent/30 bg-surface-elevated p-4">
            <p className="text-xs font-medium text-danger mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Vista de auditor (CNBV) — descifrada
            </p>
            <div className="space-y-2 text-xs">
              {[
                { name: "FintechMX · María Pérez", amount: "$294,000 MXN" },
                { name: "LogiPay · Juan López", amount: "$205,000 MXN" },
              ].map(({ name, amount }) => (
                <div
                  key={name}
                  className="flex justify-between p-2 rounded border-l-2 border-accent bg-accent/[0.03]"
                >
                  <span className="text-foreground">{name}</span>
                  <span className="font-mono text-foreground">{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
