import { CapTableEntry, CorporateEvent, Company } from "@/lib/types";
import { mockCapTable, mockCorporateEvents } from "@/lib/mocks/seed";
import { COMPANY_STATS } from "@/lib/mocks/seed-data";
import { mockCompanies } from "@/lib/mocks/companies";
import { formatAddress } from "@/lib/format";
import {
  CONTRACT_ADDRESSES,
  PRIVATE_MINT_EVENT,
  PRIVATE_TRANSFER_EVENT,
  KNOWN_ADDRESSES,
  fujiClient,
  getDeployFromBlock,
} from "@/lib/contracts";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function getCapTable(companyId: string): Promise<CapTableEntry[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return mockCapTable.filter(() => companyId === "fintechmx" || true);
  }

  // Only the deployed EncryptedERC maps to fintechmx; others fall back to mock
  if (companyId !== "fintechmx") return mockCapTable;

  const fromBlock = await getDeployFromBlock();

  const mintLogs = await fujiClient.getLogs({
    address: CONTRACT_ADDRESSES.EncryptedERC,
    event: PRIVATE_MINT_EVENT,
    fromBlock,
    toBlock: "latest",
  });

  const transferLogs = await fujiClient.getLogs({
    address: CONTRACT_ADDRESSES.EncryptedERC,
    event: PRIVATE_TRANSFER_EVENT,
    fromBlock,
    toBlock: "latest",
  });

  // Collect unique holder addresses from mint recipients and transfer recipients
  const holderSet = new Set<string>();
  for (const log of mintLogs) {
    if (log.args.user) holderSet.add(log.args.user.toLowerCase());
  }
  for (const log of transferLogs) {
    if (log.args.to) holderSet.add(log.args.to.toLowerCase());
  }

  if (holderSet.size === 0) return mockCapTable;

  const totalHolders = holderSet.size;
  const entries: CapTableEntry[] = Array.from(holderSet).map((addr) => {
    const checksumAddr = addr as `0x${string}`;
    const knownName = KNOWN_ADDRESSES[addr];
    return {
      holder: checksumAddr,
      holderName: knownName ?? formatAddress(checksumAddr),
      category: knownName?.includes("Emisor") ? "founder" : "retail",
      tokens: BigInt(0),
      pctOwnership: totalHolders > 0 ? 100 / totalHolders : 0,
    } satisfies CapTableEntry;
  });

  return entries;
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
    const stats = COMPANY_STATS[companyId];
    return {
      totalSupply: company?.totalSupply ?? BigInt(1_000_000),
      activeHolders: stats?.activeHolders ?? 87,
      volume30dMXN: stats?.volume30dMXN ?? 1_240_000,
      avgPriceMonthMXN: stats?.avgPriceMonthMXN ?? company?.lastTradePriceMXN ?? 245,
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
