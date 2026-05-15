import { CapTableEntry, CorporateEvent, Company } from "@/lib/types";
import { mockCapTable, mockCorporateEvents } from "@/lib/mocks/seed";
import { mockCompanies } from "@/lib/mocks/companies";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function getCapTable(companyId: string): Promise<CapTableEntry[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return mockCapTable.filter(() => companyId === "fintechmx" || true);
  }
  const res = await fetch(`/api/captable?companyId=${companyId}`);
  return res.json();
}

export async function getCorporateEvents(
  companyId: string
): Promise<CorporateEvent[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return mockCorporateEvents.filter((e) => e.companyId === companyId);
  }
  const res = await fetch(`/api/corporate-events?companyId=${companyId}`);
  return res.json();
}

export async function getCompanyStats(companyId: string): Promise<{
  totalSupply: bigint;
  activeHolders: number;
  volume30dMXN: number;
  avgPriceMonthMXN: number;
}> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 100));
    const company = mockCompanies.find((c) => c.id === companyId);
    return {
      totalSupply: company?.totalSupply ?? BigInt(1_000_000),
      activeHolders: 87,
      volume30dMXN: 1_240_000,
      avgPriceMonthMXN: company?.lastTradePriceMXN ?? 245,
    };
  }
  const res = await fetch(`/api/companies/${companyId}/stats`);
  return res.json();
}

export async function getIssuerCompanies(): Promise<Company[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 100));
    return mockCompanies.filter((c) => c.country === "MX");
  }
  const res = await fetch("/api/companies/mine");
  return res.json();
}
