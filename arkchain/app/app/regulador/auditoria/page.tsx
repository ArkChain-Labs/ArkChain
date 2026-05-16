"use client";

import { useState, useEffect, Fragment } from "react";
import { ShieldCheck, ExternalLink, ArrowRight } from "lucide-react";
import { useAuditEvents } from "@/lib/hooks/use-audit";
import { AuditorRow } from "@/components/shared/auditor-row";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EncryptedValue } from "@/components/shared/encrypted-value";
import { MoneyAmount } from "@/components/shared/money-amount";
import { formatAddress, formatDateTime, formatTokens, formatMXN } from "@/lib/format";
import { AuditEvent } from "@/lib/types";

function SessionTimer() {
  const [seconds, setSeconds] = useState(3600);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <span className="font-mono text-xs text-danger">
      Sesión expira en {mm}:{ss}
    </span>
  );
}

function ExpandedRow({ event }: { event: AuditEvent }) {
  return (
    <tr className="bg-surface">
      <td colSpan={9} className="px-4 py-4">
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="font-semibold text-foreground mb-2">Partes involucradas</p>
            <p className="text-foreground-muted">De: <span className="text-foreground font-medium">{event.fromName}</span></p>
            <p className="font-mono text-foreground-subtle">{event.from}</p>
            <p className="text-foreground-muted mt-1">A: <span className="text-foreground font-medium">{event.toName}</span></p>
            <p className="font-mono text-foreground-subtle">{event.to}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">Reporte Wavy Node</p>
            {event.wavyAllowed ? (
              <div className="space-y-1">
                <p className="text-success">KYC verificado</p>
                <p className="text-success">Sin alertas AML</p>
                <p className="text-success">Historial limpio</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-danger">Actividad inusual detectada</p>
                <p className="text-danger">Revisión manual requerida</p>
                <p className="text-foreground-subtle">Score: {event.wavyScore}/100 — umbral mínimo: 60</p>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">On-chain</p>
            <p className="text-foreground-muted">Bloque: <span className="font-mono text-foreground">{event.blockNumber.toLocaleString()}</span></p>
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

export default function AuditoriaPage() {
  const { data: events = [], isLoading } = useAuditEvents();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalVol = events.filter(e => e.status === "executed").reduce((s, e) => s + e.totalMXN, 0);
  const avgScore = events.length ? Math.round(events.reduce((s, e) => s + e.wavyScore, 0) / events.length) : 0;
  const blocked = events.filter(e => e.status === "blocked").length;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Auditor banner */}
      <div className="flex items-center justify-between rounded-lg border-l-4 border-danger bg-surface px-4 py-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-danger shrink-0" />
          <span className="text-sm text-foreground-muted">
            <strong className="text-foreground">Modo Auditor activo</strong> · Acceso registrado · IP 200.94.xx · Sesión iniciada 14:32 UTC-6
          </span>
        </div>
        <SessionTimer />
      </div>

      {/* Header + filters */}
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

      {/* Filters row */}
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
          { label: "Transacciones 30d", value: events.length.toString(), mono: true },
          { label: "Volumen total", value: formatMXN(totalVol), mono: true },
          { label: "Risk score prom.", value: `${avgScore}/100`, color: "text-success", mono: true },
          { label: "Trades bloqueados", value: String(blocked), color: "text-danger", mono: true },
          { label: "Plataformas activas", value: "1 (Arkangeles)", mono: false },
        ].map(({ label, value, color, mono }) => (
          <div key={label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-foreground-subtle mb-1">{label}</p>
            <p className={`text-lg font-semibold ${mono ? "font-mono tabular" : ""} ${color ?? "text-foreground"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Main audit table */}
      {isLoading ? (
        <p className="text-sm text-foreground-subtle">Cargando eventos...</p>
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
                  {["Timestamp", "De", "A", "Startup", "Tokens", "Precio MXN", "Total MXN", "Wavy", "TX Hash"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((ev) => {
                  const blocked = ev.status === "blocked";
                  const expanded = expandedId === ev.txHash;
                  return (
                    <Fragment key={ev.txHash}>
                      <AuditorRow
                        highlighted={blocked}
                        className="cursor-pointer"
                      >
                        <td
                          className="px-4 py-2.5 font-mono text-xs text-foreground-subtle whitespace-nowrap"
                          onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                        >
                          {formatDateTime(ev.timestamp)}
                        </td>
                        <td className="px-4 py-2.5 text-xs" onClick={() => setExpandedId(expanded ? null : ev.txHash)}>
                          <p className="font-medium text-foreground">{ev.fromName}</p>
                          <p className="font-mono text-foreground-subtle">{formatAddress(ev.from)}</p>
                        </td>
                        <td className="px-4 py-2.5 text-xs" onClick={() => setExpandedId(expanded ? null : ev.txHash)}>
                          <p className="font-medium text-foreground">{ev.toName}</p>
                          <p className="font-mono text-foreground-subtle">{formatAddress(ev.to)}</p>
                        </td>
                        <td className="px-4 py-2.5" onClick={() => setExpandedId(expanded ? null : ev.txHash)}>
                          <div className="flex items-center gap-1.5">
                            <img src={ev.company.logoUrl} alt={ev.company.name} className="h-5 w-5 rounded" />
                            <span className="text-xs font-medium text-foreground">{ev.company.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-mono tabular text-xs text-foreground" onClick={() => setExpandedId(expanded ? null : ev.txHash)}>
                          {formatTokens(ev.tokens)}
                        </td>
                        <td className="px-4 py-2.5 font-mono tabular text-xs text-foreground" onClick={() => setExpandedId(expanded ? null : ev.txHash)}>
                          {formatMXN(ev.pricePerTokenMXN)}
                        </td>
                        <td className="px-4 py-2.5" onClick={() => setExpandedId(expanded ? null : ev.txHash)}>
                          <MoneyAmount amount={ev.totalMXN} className="font-semibold text-xs" />
                        </td>
                        <td className="px-4 py-2.5" onClick={() => setExpandedId(expanded ? null : ev.txHash)}>
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Split view demo */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <p className="text-xs font-medium text-foreground-subtle uppercase tracking-widest mb-1">Demo</p>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Privado por defecto, auditable cuando importa
        </h2>
        <div className="grid md:grid-cols-2 gap-4 items-center">
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

          <div className="hidden md:flex justify-center">
            <div className="flex flex-col items-center gap-1 text-foreground-subtle">
              <div className="h-px w-12 bg-accent" />
              <ArrowRight className="h-5 w-5 text-accent" />
              <div className="h-px w-12 bg-accent" />
            </div>
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
                <div key={name} className="flex justify-between p-2 rounded border-l-2 border-accent bg-accent/[0.03]">
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
