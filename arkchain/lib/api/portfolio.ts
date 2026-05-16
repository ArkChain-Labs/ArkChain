import { Holding, Address } from "@/lib/types";
import { mockHoldings } from "@/lib/mocks/seed";
import { mockCompanies, getCompany } from "@/lib/mocks/companies";
import {
  CONTRACT_ADDRESSES,
  PRIVATE_MINT_EVENT,
  PRIVATE_TRANSFER_EVENT,
  EERC20_TO_COMPANY_ID,
  fujiClient,
  getDeployFromBlock,
} from "@/lib/contracts";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function getPortfolio(address: Address): Promise<Holding[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return (
      mockHoldings[address] ??
      mockHoldings["0xDEFAULT000000000000000000000000000000000A"]
    );
  }

  const fromBlock = await getDeployFromBlock();

  // Tokens minted directly to user
  const mintLogs = await fujiClient.getLogs({
    address: CONTRACT_ADDRESSES.EncryptedERC,
    event: PRIVATE_MINT_EVENT,
    args: { user: address },
    fromBlock,
    toBlock: "latest",
  });

  // Tokens transferred to user
  const transferLogs = await fujiClient.getLogs({
    address: CONTRACT_ADDRESSES.EncryptedERC,
    event: PRIVATE_TRANSFER_EVENT,
    args: { to: address },
    fromBlock,
    toBlock: "latest",
  });

  const hasHolding = mintLogs.length > 0 || transferLogs.length > 0;
  if (!hasHolding) return [];

  // User holds EncryptedERC tokens; amounts are ZK-encrypted — show as encrypted
  const companyId =
    EERC20_TO_COMPANY_ID[CONTRACT_ADDRESSES.EncryptedERC.toLowerCase()] ??
    "fintechmx";
  const company = getCompany(companyId) ?? mockCompanies[0];

  return [
    {
      companyId,
      company,
      tokensOwned: BigInt(0),
      estimatedValueMXN: 0,
      pnl30dPct: 0,
      encrypted: true,
    },
  ];
}

export async function getHoldingDetail(
  address: Address,
  companyId: string
): Promise<Holding | null> {
  const all = await getPortfolio(address);
  return all.find((h) => h.companyId === companyId) ?? null;
}
