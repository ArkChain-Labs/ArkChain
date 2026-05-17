// Deployed on Avalanche Fuji — 2026-05-17
// Source of truth: addresses.json at project root
import { createPublicClient, http, parseAbiItem } from "viem";
import { avalancheFuji } from "viem/chains";

export const CONTRACT_ADDRESSES = {
  OrderBook:    "0x20F4e7E2d87ad8C20D84070855Ae79EeAE41E981" as `0x${string}`,
  EncryptedERC: "0x95174aA6Fb32157Cf5b57ce8f48Bd8B36D676292" as `0x${string}`,
  MockUSDC:     "0xf9fd07ed0b26c74388015ce381E9EcB18ED4C120" as `0x${string}`,
  Registrar:    "0xc413D0014f60dba06b5aC9A0734ff95cc01CDe03" as `0x${string}`,
};

export const KNOWN_ADDRESSES: Record<string, string> = {
  "0x67bfa2dc3bc228fc4947683cc7f10ad1527acd77": "Auditor CNBV",
  "0x47bfb16f80e892d8bc2dc7aae2312979e4016b17": "Arkangeles (Emisor)",
};

// JSON ABI for writeContract calls (functions only)
export const ORDER_BOOK_ABI = [
  {
    name: "postOrder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "orderId", type: "uint256" },
      { name: "eERC20", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "pricePerToken", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// Parsed event ABIs for getLogs
export const ORDER_POSTED_EVENT = parseAbiItem(
  "event OrderPosted(uint256 indexed orderId, address indexed seller, address eERC20, uint256 tokenId, uint256 amount, uint256 pricePerToken)"
);

export const ORDER_EXECUTED_EVENT = parseAbiItem(
  "event OrderExecuted(uint256 indexed orderId, address indexed seller, address indexed buyer, address eERC20, uint256 tokenId, uint256 amount, uint256 usdcTotal)"
);

export const ORDER_CANCELLED_EVENT = parseAbiItem(
  "event OrderCancelled(uint256 indexed orderId, address indexed seller)"
);

// EncryptedERC events — amounts are ZK-encrypted; only addresses are readable
export const PRIVATE_TRANSFER_EVENT = parseAbiItem(
  "event PrivateTransfer(address indexed from, address indexed to, uint256[7] auditorPCT, address indexed auditorAddress)"
);

export const PRIVATE_MINT_EVENT = parseAbiItem(
  "event PrivateMint(address indexed user, uint256[7] auditorPCT, address indexed auditorAddress)"
);

// eERC20 contract address → frontend companyId (one EncryptedERC deployed for hackathon)
export const EERC20_TO_COMPANY_ID: Record<string, string> = {
  "0x95174aa6fb32157cf5b57ce8f48bd8b36d676292": "fintechmx",
};

// Hardcoded rate for MXN↔USDC conversion (no oracle in hackathon)
export const MXN_PER_USDC = 17.5;

export const fujiClient = createPublicClient({
  chain: avalancheFuji,
  transport: http("https://api.avax-test.network/ext/bc/C/rpc"),
});

// Scan the last ~2 days of blocks to capture all post-deploy events
export async function getDeployFromBlock(): Promise<bigint> {
  try {
    const current = await fujiClient.getBlockNumber();
    const window = BigInt(100_000);
    return current > window ? current - window : BigInt(0);
  } catch {
    return BigInt(0);
  }
}
