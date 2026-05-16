import { AuditEvent, Address } from "@/lib/types";
import { mockAuditEvents } from "@/lib/mocks/seed";
import { mockCompanies, getCompany } from "@/lib/mocks/companies";
import { formatAddress } from "@/lib/format";
import { KNOWN_ADDRESSES, MXN_PER_USDC } from "@/lib/contracts";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// Shape returned by the backend /api/transactions endpoint
interface TradeEvent {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  seller: string;
  buyer: string;
  orderId: string;
  tokenAmount: string;
  pricePerToken: string;
  totalUSDC: string;
  wavyScore: number;
}

function tradeEventToAuditEvent(t: TradeEvent): AuditEvent {
  const from = t.seller as Address;
  const to = t.buyer as Address;
  const tokens = BigInt(t.tokenAmount || "0");
  const totalUSDC = Number(t.totalUSDC || "0") / 1_000_000;
  const totalMXN = totalUSDC * MXN_PER_USDC;

  // Derive price per token from totals when pricePerToken is missing
  const tokenCount = Number(tokens);
  const pricePerTokenMXN =
    tokenCount > 0 ? totalMXN / tokenCount : mockCompanies[0].lastTradePriceMXN;

  const fromName =
    KNOWN_ADDRESSES[from.toLowerCase()] ?? formatAddress(from);
  const toName =
    KNOWN_ADDRESSES[to.toLowerCase()] ?? formatAddress(to);

  return {
    txHash: t.txHash,
    blockNumber: t.blockNumber,
    timestamp: t.timestamp * 1000, // backend sends Unix seconds; frontend expects ms
    from,
    fromName,
    to,
    toName,
    companyId: "fintechmx",
    company: getCompany("fintechmx") ?? mockCompanies[0],
    tokens,
    pricePerTokenMXN,
    totalMXN,
    wavyScore: t.wavyScore,
    wavyAllowed: t.wavyScore >= 60,
    status: "executed",
  };
}

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
  const raw: TradeEvent[] = await res.json().catch(() => []);
  if (!Array.isArray(raw)) return [];

  let events = raw.map(tradeEventToAuditEvent);

  // Apply client-side filters (address search)
  if (filters.address) {
    const q = filters.address.toLowerCase();
    events = events.filter(
      (e) => e.from.toLowerCase().includes(q) || e.to.toLowerCase().includes(q)
    );
  }
  if (filters.minScore !== undefined)
    events = events.filter((e) => e.wavyScore >= filters.minScore!);
  if (filters.maxScore !== undefined)
    events = events.filter((e) => e.wavyScore <= filters.maxScore!);

  return events;
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
