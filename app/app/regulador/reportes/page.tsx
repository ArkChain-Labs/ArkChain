"use client";

import { useState } from "react";
import { Download, FileText, Info } from "lucide-react";
import { generateReport } from "@/lib/api/reports";
import { ReportConfig } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const REPORT_TYPES: { value: ReportConfig["type"]; label: string; desc: string }[] = [
  { value: "quarterly-secondary", label: "Trimestral de operaciones secundarias", desc: "Reporte estándar CNBV-1437 con todas las transacciones del periodo." },
  { value: "aml-summary", label: "AML/KYC compliance summary", desc: "Resumen de verificaciones de identidad y alertas AML detectadas." },
  { value: "point-audit", label: "Auditoría puntual (rango personalizado)", desc: "Exporta todas las transacciones de un rango de fechas específico." },
  { value: "wavy-compliance", label: "Cumplimiento Wavy Node", desc: "Estadísticas de scores de riesgo y operaciones bloqueadas." },
];

const JURISDICTIONS: Array<{ value: ReportConfig["jurisdictions"][number]; label: string }> = [
  { value: "MX", label: "México" },
  { value: "BR", label: "Brasil" },
  { value: "CO", label: "Colombia" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Perú" },
];

const PLATFORMS = ["Arkangeles", "BEE4", "a2censo", "100 Ventures", "Broota", "Crowdium"];
const FORMATS: Array<{ value: ReportConfig["format"]; label: string }> = [
  { value: "csv", label: "CSV" },
  { value: "pdf", label: "PDF" },
  { value: "xbrl", label: "XBRL" },
];

const PREVIEW_STATS = [
  { label: "Transacciones procesadas", value: "1,247" },
  { label: "Volumen total", value: "$42,847,300 MXN" },
  { label: "Ops. bloqueadas (Wavy)", value: "12" },
  { label: "Score prom. de cumplimiento", value: "91/100" },
  { label: "Plataformas incluidas", value: "1 (Arkangeles)" },
  { label: "Jurisdicciones", value: "MX" },
];

export default function ReportesPage() {
  const [reportType, setReportType] = useState<ReportConfig["type"]>("quarterly-secondary");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-03-31");
  const [jurisdictions, setJurisdictions] = useState<Array<ReportConfig["jurisdictions"][number]>>(["MX"]);
  const [platforms, setPlatforms] = useState<string[]>(["Arkangeles"]);
  const [format, setFormat] = useState<ReportConfig["format"]>("pdf");
  const [loading, setLoading] = useState(false);

  function toggleJurisdiction(j: ReportConfig["jurisdictions"][number]) {
    setJurisdictions((prev) =>
      prev.includes(j) ? prev.filter((x) => x !== j) : [...prev, j]
    );
  }

  function togglePlatform(p: string) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const blob = await generateReport({
        type: reportType,
        from: new Date(from).getTime(),
        to: new Date(to).getTime(),
        jurisdictions,
        platforms,
        format,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `arkchain-reporte-${reportType}-${from}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Generador de reportes regulatorios
          </h1>
          <p className="text-sm text-foreground-subtle mt-0.5">
            Reportes auto-generados desde el ledger on-chain, formato CNBV-1437
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Configurator */}
          <div className="space-y-5">
            {/* Report type */}
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                Tipo de reporte
              </p>
              <div className="space-y-2">
                {REPORT_TYPES.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setReportType(value)}
                    className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                      reportType === value
                        ? "border-accent bg-accent/5"
                        : "border-border bg-surface hover:border-foreground-subtle"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                        reportType === value ? "border-accent bg-accent" : "border-border"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-foreground-subtle mt-0.5">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Period */}
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                Periodo
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-foreground-muted mb-1 block">Desde</Label>
                  <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-surface border-border text-xs" />
                </div>
                <div>
                  <Label className="text-xs text-foreground-muted mb-1 block">Hasta</Label>
                  <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-surface border-border text-xs" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Jurisdictions */}
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                Jurisdicción
              </p>
              <div className="flex flex-wrap gap-2">
                {JURISDICTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleJurisdiction(value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      jurisdictions.includes(value)
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground-muted hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                Plataformas
              </p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      platforms.includes(p)
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground-muted hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Format */}
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                Formato de salida
              </p>
              <div className="flex gap-2">
                {FORMATS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFormat(value)}
                    className={`rounded-lg px-4 py-2 text-xs font-mono font-medium transition-colors ${
                      format === value
                        ? "bg-foreground text-background"
                        : "border border-border text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {loading ? "Generando..." : "Generar reporte"}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="rounded-lg border border-border bg-surface-elevated overflow-hidden flex flex-col">
            <div className="bg-primary px-4 py-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary-foreground/70" />
              <span className="text-xs font-medium text-primary-foreground">Vista previa del documento</span>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {/* CNBV letterhead */}
              <div className="border-b border-border pb-4 mb-4">
                <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-1">
                  CNBV · Comisión Nacional Bancaria y de Valores
                </p>
                <p className="font-display text-lg font-semibold text-foreground">
                  Reporte de Mercado Secundario Privado
                </p>
                <p className="text-xs text-foreground-subtle font-mono">
                  Formato CNBV-1437 · ArkChain Infrastructure · {new Date().getFullYear()}
                </p>
              </div>

              {/* Summary stats */}
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                Resumen ejecutivo
              </p>
              <div className="space-y-2 mb-6">
                {PREVIEW_STATS.map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-foreground-muted">{label}</span>
                    <span className="font-mono font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <p className="text-xs text-foreground-subtle italic mb-4">
                [Vista previa parcial. Generar para ver el reporte completo con todas las transacciones.]
              </p>

              <div className="space-y-1 text-xs">
                {["FintechMX · 200 TKN · $49,600 MXN · Score 91", "LogiPay · 100 TKN · $41,200 MXN · Score 88", "⚠ BLOQUEADO · AgroTech · Score 47"].map((row) => (
                  <div
                    key={row}
                    className={`px-2 py-1.5 rounded font-mono ${
                      row.startsWith("⚠")
                        ? "bg-danger/8 text-danger border-l-2 border-danger"
                        : "bg-surface text-foreground-muted"
                    }`}
                  >
                    {row}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border p-4 flex gap-2">
              <button className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-surface transition-colors flex items-center justify-center gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Descargar borrador
              </button>
              <Tooltip>
                <TooltipTrigger className="flex-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  Firmar y enviar a CNBV
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Requiere doble firma del oficial de cumplimiento designado.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
