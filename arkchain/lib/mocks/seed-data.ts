// Enriched demo data — extends the base mock layer in seed.ts.
// Import from here when screens need valuations, clean audit events, or other
// data not exposed by seed.ts directly.

import { mockAuditEvents } from "./seed";
import type { AuditEvent } from "@/lib/types";

// Per-company enrichment used across cap-table, portfolio header, and landing.
export const COMPANY_STATS: Record<
  string,
  {
    valuationLabel: string;
    volume30dMXN: number;
    activeHolders: number;
    avgPriceMonthMXN: number;
  }
> = {
  fintechmx: {
    valuationLabel: "$45M USD · Serie A",
    volume30dMXN: 1_240_000,
    activeHolders: 87,
    avgPriceMonthMXN: 245,
  },
  logipay: {
    valuationLabel: "$28M USD · Serie A",
    volume30dMXN: 620_000,
    activeHolders: 54,
    avgPriceMonthMXN: 410,
  },
  agrotech: {
    valuationLabel: "$18M USD · Seed+",
    volume30dMXN: 380_000,
    activeHolders: 38,
    avgPriceMonthMXN: 178,
  },
  eduplus: {
    valuationLabel: "$12M USD · Seed",
    volume30dMXN: 210_000,
    activeHolders: 22,
    avgPriceMonthMXN: 320,
  },
  saluddigital: {
    valuationLabel: "$22M USD · Serie A",
    volume30dMXN: 490_000,
    activeHolders: 44,
    avgPriceMonthMXN: 195,
  },
};

// 15 clean historical transactions (scores 72-98, all executed).
// Derived from mockAuditEvents by excluding the single blocked event.
export const cleanAuditEvents: AuditEvent[] = mockAuditEvents
  .filter((e) => e.status === "executed" && e.wavyScore >= 72)
  .slice(0, 15);
