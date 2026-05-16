import { ReportConfig } from "@/lib/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function generateReport(config: ReportConfig): Promise<Blob> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    const content = `CNBV-1437 REPORTE REGULATORIO
Tipo: ${config.type}
Periodo: ${new Date(config.from).toLocaleDateString("es-MX")} — ${new Date(config.to).toLocaleDateString("es-MX")}
Jurisdicciones: ${config.jurisdictions.join(", ")}
Plataformas: ${config.platforms.join(", ")}

RESUMEN EJECUTIVO
Transacciones procesadas: 1,247
Volumen total: $42,847,300 MXN
Operaciones bloqueadas (Wavy Node): 12
Score promedio de cumplimiento: 91/100

OPERACIONES SECUNDARIAS
[Datos detallados disponibles en version completa]

--- Generado por ArkChain · ${new Date().toLocaleString("es-MX")} ---`;
    return new Blob([content], { type: "text/plain" });
  }
  const res = await fetch("/api/reports/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  return res.blob();
}
