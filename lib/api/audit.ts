import { AuditEvent } from "@/lib/types";
import { mockAuditEvents } from "@/lib/mocks/seed";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export interface AuditFilters {
  jurisdiction?: string;
  platform?: string;
  from?: number;
  to?: number;
  minScore?: number;
  maxScore?: number;
  address?: string;
}

export async function getAuditEvents(
  filters: AuditFilters = {}
): Promise<AuditEvent[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    let events = [...mockAuditEvents];
    if (filters.from) events = events.filter((e) => e.timestamp >= filters.from!);
    if (filters.to) events = events.filter((e) => e.timestamp <= filters.to!);
    if (filters.minScore !== undefined)
      events = events.filter((e) => e.wavyScore >= filters.minScore!);
    if (filters.maxScore !== undefined)
      events = events.filter((e) => e.wavyScore <= filters.maxScore!);
    if (filters.address)
      events = events.filter(
        (e) =>
          e.from.toLowerCase().includes(filters.address!.toLowerCase()) ||
          e.to.toLowerCase().includes(filters.address!.toLowerCase())
      );
    return events;
  }
  const params = new URLSearchParams(
    Object.entries(filters)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  );
  const res = await fetch(`/api/audit?${params}`);
  return res.json();
}

export async function getAuditorAccessLog(): Promise<
  { auditorId: string; timestamp: number; action: string }[]
> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 100));
    return [
      { auditorId: "Aud-CNBV-03", timestamp: Date.now() - 86_400_000, action: "Exportación de reporte Q1 2026" },
      { auditorId: "Aud-CNBV-01", timestamp: Date.now() - 3 * 86_400_000, action: "Consulta de transacción 0xabc..." },
    ];
  }
  const res = await fetch("/api/audit/access-log");
  return res.json();
}
