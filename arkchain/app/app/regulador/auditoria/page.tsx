"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import {
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Lock,
  LockOpen,
  ChevronDown,
  ChevronRight,
  FileDown,
  Loader2,
} from "lucide-react";
import { useAuditEvents } from "@/lib/hooks/use-audit";
import { AuditorRow } from "@/components/shared/auditor-row";
import { EncryptedValue } from "@/components/shared/encrypted-value";
import { MoneyAmount } from "@/components/shared/money-amount";
import { formatDateTime, formatMXN } from "@/lib/format";
import type { AuditEvent } from "@/lib/types";

// ── Toast ─────────────────────────────────────────────────────────────────────

interface ToastMsg {
  id: number;
  message: string;
}

function Toast({ msg, onDone }: { msg: ToastMsg; onDone: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(msg.id), 4000);
    return () => clearTimeout(t);
  }, [msg.id, onDone]);
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-elevated px-4 py-3 shadow-lg text-sm text-foreground"
      style={{ animation: "fadeSlideUp 0.2s ease" }}
    >
      <Check className="h-4 w-4 text-success shrink-0" />
      {msg.message}
    </div>
  );
}

// ── Wavy score badge (colored) ────────────────────────────────────────────────

function WavyBadge({ score }: { score: number }) {
  const { cls, label } =
    score >= 80
      ? { cls: "bg-success/10 text-success border-success/25", label: "Alto" }
      : score >= 60
      ? { cls: "bg-warning/15 text-warning border-warning/25", label: "Medio" }
      : { cls: "bg-danger/10 text-danger border-danger/25", label: "Bajo" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-mono tabular-nums ${cls}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background:
            score >= 80 ? "var(--color-success)" : score >= 60 ? "var(--color-warning)" : "var(--color-danger)",
        }}
      />
      {score} <span className="text-[10px] opacity-60">{label}</span>
    </span>
  );
}

// ── Copy TxHash button ────────────────────────────────────────────────────────

function CopyTxHash({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(hash).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    },
    [hash]
  );
  const short = `${hash.slice(0, 6)}…${hash.slice(-6)}`;
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-xs text-foreground-subtle whitespace-nowrap">{short}</span>
      <button
        onClick={copy}
        className="text-foreground-subtle hover:text-foreground transition-colors"
        title="Copiar TX hash"
      >
        {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
      </button>
      <a
        href={`https://testnet.snowtrace.io/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title="Ver en Snowtrace"
      >
        <ExternalLink className="h-3 w-3 text-foreground-subtle hover:text-accent transition-colors" />
      </a>
    </div>
  );
}

// ── Sync timestamp ────────────────────────────────────────────────────────────

function SyncTimestamp() {
  const [ts, setTs] = useState("");
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

// ── Institutional CNBV header ─────────────────────────────────────────────────

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
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-black uppercase text-white"
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

// ── Expanded row ──────────────────────────────────────────────────────────────

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

// ── Report CSV generation ─────────────────────────────────────────────────────

function generateCsv(events: AuditEvent[]): string {
  const header = [
    "Timestamp",
    "De (nombre)",
    "De (address)",
    "A (nombre)",
    "A (address)",
    "Startup",
    "Tokens",
    "Precio MXN",
    "Total MXN",
    "Wavy Score",
    "Estado",
    "TX Hash",
    "Bloque",
  ].join(",");

  const rows = events.map((e) =>
    [
      formatDateTime(e.timestamp),
      `"${e.fromName}"`,
      e.from,
      `"${e.toName}"`,
      e.to,
      `"${e.company.name}"`,
      Number(e.tokens),
      e.pricePerTokenMXN,
      e.totalMXN,
      e.wavyScore,
      e.status,
      e.txHash,
      e.blockNumber,
    ].join(",")
  );

  return [header, ...rows].join("\n");
}

// ── Mock auditor access log ───────────────────────────────────────────────────

const MOCK_ACCESS_LOG = [
  {
    timestamp: Date.now() - 120_000,
    action: "Consulta de transacciones",
    ip: "192.168.1.42",
    auditorId: "Aud-CNBV-03",
  },
  {
    timestamp: Date.now() - 1_800_000,
    action: "Generación de reporte",
    ip: "192.168.1.42",
    auditorId: "Aud-CNBV-03",
  },
  {
    timestamp: Date.now() - 86_400_000,
    action: "Consulta de transacciones",
    ip: "192.168.1.17",
    auditorId: "Aud-CNBV-01",
  },
  {
    timestamp: Date.now() - 90_000_000,
    action: "Generación de reporte",
    ip: "192.168.1.17",
    auditorId: "Aud-CNBV-01",
  },
  {
    timestamp: Date.now() - 172_800_000,
    action: "Acceso inicial",
    ip: "192.168.1.33",
    auditorId: "Aud-CNBV-02",
  },
  {
    timestamp: Date.now() - 259_200_000,
    action: "Consulta de transacciones",
    ip: "192.168.1.42",
    auditorId: "Aud-CNBV-03",
  },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const { data: events = [], isLoading } = useAuditEvents();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  // Stats
  const totalVol = events
    .filter((e) => e.status === "executed")
    .reduce((s, e) => s + e.totalMXN, 0);
  const avgScore = events.length
    ? Math.round(events.reduce((s, e) => s + e.wavyScore, 0) / events.length)
    : 0;
  const blockedCount = events.filter((e) => e.status === "blocked").length;

  // The most recent event for the comparison section
  const latestEvent = events[0];

  // Report download
  const handleReport = useCallback(async () => {
    setReportLoading(true);
    await new Promise((r) => setTimeout(r, 1800)); // simulate generation
    const csv = generateCsv(events);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arkchain-reporte-Q2-2026.csv";
    a.click();
    URL.revokeObjectURL(url);
    setReportLoading(false);
    addToast("Reporte generado — arkchain-reporte-Q2-2026.csv");
  }, [events, addToast]);

  return (
    <>
      {/* ── Toast container ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} msg={t} onDone={removeToast} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto space-y-5">
        {/* ── 1. Institutional CNBV header ── */}
        <AuditorModeHeader />

        {/* ── Page title + report button ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Auditoría — Mercado secundario
            </h1>
            <p className="text-sm text-foreground-subtle mt-0.5">
              Vista descifrada con llave de auditor. Todo acceso queda registrado en el ledger inmutable.
            </p>
          </div>

          {/* ── 4. Report button ── */}
          <button
            onClick={handleReport}
            disabled={reportLoading || events.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reportLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando…
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Generar reporte trimestral
              </>
            )}
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
            { label: "Trades bloqueados", value: String(blockedCount), color: "text-danger" },
            { label: "Plataformas activas", value: "1 (Arkangeles)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs text-foreground-subtle mb-1">{label}</p>
              <p
                className={`text-lg font-semibold font-mono tabular-nums ${color ?? "text-foreground"}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── 2. Main audit table — institutional style ── */}
        {isLoading ? (
          <div className="rounded-lg border border-border bg-surface p-16 text-center">
            <Loader2 className="h-5 w-5 animate-spin text-foreground-subtle mx-auto mb-2" />
            <p className="text-sm text-foreground-subtle">Sincronizando con la blockchain…</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {/* Table toolbar */}
            <div className="bg-surface px-4 py-2.5 border-b border-border flex items-center justify-between">
              <p className="text-xs text-foreground-subtle font-mono">
                {events.length} transacciones · Vista descifrada · Aud-CNBV-03
              </p>
              <p className="text-xs font-mono text-foreground-subtle">
                Última exportación: 14 may 2026, 09:12
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[960px]">
                <thead>
                  <tr
                    className="border-b border-border"
                    style={{ background: "var(--color-surface)" }}
                  >
                    {[
                      { label: "Timestamp", mono: true },
                      { label: "De", mono: false },
                      { label: "A", mono: false },
                      { label: "Tokens", mono: true },
                      { label: "Monto USDC", mono: true },
                      { label: "Total MXN", mono: true },
                      { label: "Wavy Score", mono: false },
                      { label: "Estado", mono: false },
                      { label: "TX Hash", mono: true },
                    ].map(({ label, mono }) => (
                      <th
                        key={label}
                        className={`text-left px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wider ${mono ? "font-mono" : ""}`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-20 text-center">
                        <ShieldCheck className="h-8 w-8 text-foreground-subtle mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium text-foreground-muted">
                          No hay transacciones registradas en este período.
                        </p>
                        <p className="text-xs text-foreground-subtle mt-1">
                          Las operaciones ejecutadas aparecerán aquí en tiempo real.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    events.map((ev, idx) => {
                      const isBlocked = ev.status === "blocked";
                      const expanded = expandedId === ev.txHash;
                      // Alternating rows with very subtle background
                      const altBg =
                        idx % 2 === 0 ? "bg-surface" : "bg-surface-elevated";

                      return (
                        <Fragment key={ev.txHash}>
                          <AuditorRow
                            highlighted={isBlocked}
                            className={`cursor-pointer ${!isBlocked ? altBg : ""}`}
                          >
                            {/* Timestamp */}
                            <td
                              className="px-4 py-2.5 font-mono text-xs text-foreground-subtle whitespace-nowrap"
                              onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                            >
                              {formatDateTime(ev.timestamp)}
                            </td>
                            {/* From */}
                            <td
                              className="px-4 py-2.5 text-xs"
                              onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                            >
                              <p className="font-medium text-foreground">{ev.fromName}</p>
                              <p className="font-mono text-foreground-subtle text-[10px] mt-0.5">
                                {ev.from.slice(0, 6)}…{ev.from.slice(-4)}
                              </p>
                            </td>
                            {/* To */}
                            <td
                              className="px-4 py-2.5 text-xs"
                              onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                            >
                              <p className="font-medium text-foreground">{ev.toName}</p>
                              <p className="font-mono text-foreground-subtle text-[10px] mt-0.5">
                                {ev.to.slice(0, 6)}…{ev.to.slice(-4)}
                              </p>
                            </td>
                            {/* Tokens */}
                            <td
                              className="px-4 py-2.5 font-mono tabular-nums text-xs text-foreground"
                              onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                            >
                              {Number(ev.tokens).toLocaleString("es-MX")}
                            </td>
                            {/* USDC amount */}
                            <td
                              className="px-4 py-2.5 font-mono tabular-nums text-xs text-foreground"
                              onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                            >
                              {formatMXN(ev.pricePerTokenMXN)}
                            </td>
                            {/* Total MXN */}
                            <td
                              className="px-4 py-2.5"
                              onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                            >
                              <MoneyAmount amount={ev.totalMXN} className="font-semibold text-xs" />
                            </td>
                            {/* Wavy score */}
                            <td
                              className="px-4 py-2.5"
                              onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                            >
                              <WavyBadge score={ev.wavyScore} />
                            </td>
                            {/* Status */}
                            <td
                              className="px-4 py-2.5"
                              onClick={() => setExpandedId(expanded ? null : ev.txHash)}
                            >
                              <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border ${
                                  isBlocked
                                    ? "bg-danger/10 text-danger border-danger/25"
                                    : "bg-success/10 text-success border-success/25"
                                }`}
                              >
                                {isBlocked ? "Bloqueado" : "Ejecutado"}
                              </span>
                            </td>
                            {/* TX Hash */}
                            <td className="px-4 py-2.5">
                              <CopyTxHash hash={ev.txHash} />
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

        {/* ── 3. Encrypted vs decrypted comparison ── */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-widest mb-0.5">
              Privacidad selectiva eERC20
            </p>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Vista del inversionista vs. vista del regulador
            </h2>
            <p className="text-xs text-foreground-subtle mt-0.5">
              La misma transacción, dos perspectivas — separadas por la llave de auditor eERC20.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr]">
            {/* Investor panel */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-elevated">
                  <Lock className="h-3.5 w-3.5 text-foreground-muted" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Vista del inversionista</p>
                  <p className="text-xs text-foreground-subtle">Datos privados — cifrado eERC20</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-surface p-3 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted">Transacción</span>
                    <span className="font-mono text-foreground-subtle">
                      {latestEvent
                        ? `${latestEvent.txHash.slice(0, 6)}…${latestEvent.txHash.slice(-4)}`
                        : "0xabc1…0001"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted">De</span>
                    <EncryptedValue value="0x67bF…cd77" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted">A</span>
                    <EncryptedValue value="0x47bF…B17" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted">Tokens</span>
                    <EncryptedValue value="200 tokens" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted font-medium">Monto</span>
                    <EncryptedValue value="$49,600 MXN" />
                  </div>
                </div>
                <p className="text-xs text-foreground-subtle text-center">
                  El inversionista solo ve sus propias posiciones — nunca las de terceros.
                </p>
              </div>
            </div>

            {/* Divider with label */}
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-surface-elevated">
              <div className="h-8 w-px bg-accent/40" />
              <div
                className="rounded-lg px-3 py-2 text-center"
                style={{
                  background: "rgba(var(--color-accent), 0.08)",
                  border: "1px solid rgba(var(--color-accent), 0.2)",
                }}
              >
                <p className="text-xs font-bold text-accent uppercase tracking-wide whitespace-nowrap">
                  llave de auditor
                </p>
                <p className="text-xs text-accent/70 font-mono whitespace-nowrap">eERC20</p>
              </div>
              <div className="h-8 w-px bg-accent/40" />
            </div>

            {/* CNBV panel */}
            <div
              className="p-6"
              style={{ background: "rgba(117,169,78,0.04)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md"
                  style={{
                    background: "rgba(117,169,78,0.12)",
                    border: "1px solid rgba(117,169,78,0.25)",
                  }}
                >
                  <LockOpen className="h-3.5 w-3.5 text-success" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Vista CNBV (auditor)</p>
                  <p className="text-xs text-success">Completamente descifrado</p>
                </div>
              </div>

              <div className="space-y-3">
                <div
                  className="rounded-lg p-3 text-xs space-y-2"
                  style={{
                    border: "1px solid rgba(117,169,78,0.2)",
                    background: "rgba(117,169,78,0.05)",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted">Transacción</span>
                    <span className="font-mono text-foreground">
                      {latestEvent
                        ? `${latestEvent.txHash.slice(0, 6)}…${latestEvent.txHash.slice(-4)}`
                        : "0xabc1…0001"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted">De</span>
                    <span className="font-medium text-foreground">
                      {latestEvent ? latestEvent.fromName : "María Pérez García"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted">A</span>
                    <span className="font-medium text-foreground">
                      {latestEvent ? latestEvent.toName : "Juan López Martínez"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted">Tokens</span>
                    <span className="font-mono text-foreground">
                      {latestEvent
                        ? `${Number(latestEvent.tokens).toLocaleString("es-MX")} tokens`
                        : "200 tokens"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-muted font-medium">Monto</span>
                    <span className="font-mono font-semibold text-success">
                      {latestEvent ? formatMXN(latestEvent.totalMXN) : "$49,600 MXN"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-success/70 text-center">
                  La CNBV ve todos los balances descifrados con su llave de auditor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Auditor access log (collapsible) ── */}
        <div className="rounded-lg border border-border overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3.5 bg-surface hover:bg-surface-elevated transition-colors text-left"
            onClick={() => setLogOpen((o) => !o)}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-foreground-muted shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Log de accesos a llave de auditor
                </p>
                <p className="text-xs text-foreground-subtle">
                  Registro inmutable de cada uso de la llave · {MOCK_ACCESS_LOG.length} entradas
                </p>
              </div>
            </div>
            {logOpen ? (
              <ChevronDown className="h-4 w-4 text-foreground-subtle shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-foreground-subtle shrink-0" />
            )}
          </button>

          {logOpen && (
            <div className="border-t border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {["Timestamp", "Auditor ID", "Acción", "IP"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-2.5 font-semibold text-foreground-subtle uppercase tracking-wider font-mono"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_ACCESS_LOG.map((entry, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-surface" : "bg-surface-elevated"}
                    >
                      <td className="px-5 py-2.5 font-mono text-foreground-subtle whitespace-nowrap">
                        {formatDateTime(entry.timestamp)}
                      </td>
                      <td className="px-5 py-2.5 font-mono text-foreground">
                        {entry.auditorId}
                      </td>
                      <td className="px-5 py-2.5 text-foreground">{entry.action}</td>
                      <td className="px-5 py-2.5 font-mono text-foreground-subtle">
                        {entry.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-5 py-3 text-xs text-foreground-subtle border-t border-border bg-surface">
                Estos registros son generados automáticamente y no pueden modificarse. Acceso solo
                para reguladores autorizados.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
