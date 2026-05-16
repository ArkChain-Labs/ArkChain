import { Holding, Address } from "@/lib/types";
import { mockHoldings } from "@/lib/mocks/seed";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function getPortfolio(address: Address): Promise<Holding[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return mockHoldings[address] ?? mockHoldings["0xDEFAULT000000000000000000000000000000000A"];
  }
  const res = await fetch(`/api/portfolio?address=${address}`);
  return res.json();
}

export async function getHoldingDetail(
  address: Address,
  companyId: string
): Promise<Holding | null> {
  const all = await getPortfolio(address);
  return all.find((h) => h.companyId === companyId) ?? null;
}
