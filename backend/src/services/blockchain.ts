import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join } from "path";
import type { TradeEvent } from "../types";

const addresses = JSON.parse(
  readFileSync(join(process.cwd(), "addresses.json"), "utf8")
);

const ORDER_BOOK_ABI = [
  "function executeOrder(uint256 orderId) external",
  "function postOrder(uint256 orderId, address eERC20, uint256 tokenId, uint256 amount, uint256 pricePerToken) external",
  "function cancelOrder(uint256 orderId) external",
  "function orders(uint256) external view returns (address seller, address eERC20, uint256 tokenId, uint256 amount, uint256 pricePerToken, uint8 status)",
  "event OrderExecuted(uint256 indexed orderId, address indexed seller, address indexed buyer, address eERC20, uint256 tokenId, uint256 amount, uint256 usdcTotal)",
  "event OrderPosted(uint256 indexed orderId, address indexed seller, address eERC20, uint256 tokenId, uint256 amount, uint256 pricePerToken)",
  "event OrderCancelled(uint256 indexed orderId, address indexed seller)",
];

export const provider = new ethers.JsonRpcProvider(
  process.env.FUJI_RPC ?? "https://avalanche-fuji-c-chain-rpc.publicnode.com"
);

export function getRelayerWallet(): ethers.Wallet {
  const key = process.env.RELAYER_PRIVATE_KEY;
  if (!key) throw new Error("RELAYER_PRIVATE_KEY not set");
  return new ethers.Wallet(key, provider);
}

export function getOrderBook(signerOrProvider?: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    addresses.contracts.OrderBook,
    ORDER_BOOK_ABI,
    signerOrProvider ?? provider
  );
}

// In-memory store for wavy scores attached to trades
const wavyScores = new Map<string, number>();

export function saveWavyScore(txHash: string, score: number) {
  wavyScores.set(txHash.toLowerCase(), score);
}

export async function fetchTradeEvents(
  fromBlock: number = 0
): Promise<TradeEvent[]> {
  if (fromBlock === 0) {
    const current = await provider.getBlockNumber();
    fromBlock = Math.max(0, current - 49_000);
  }

  const orderBook = getOrderBook();
  const filter = orderBook.filters.OrderExecuted();

  const logs = await orderBook.queryFilter(filter, fromBlock, "latest");

  const events: (TradeEvent | null)[] = await Promise.all(
    logs.map(async (log) => {
      const parsed = orderBook.interface.parseLog({
        topics: [...log.topics],
        data: log.data,
      });
      if (!parsed) return null;

      const block = await provider.getBlock(log.blockNumber);

      return {
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        timestamp: block?.timestamp ?? 0,
        seller: parsed.args.seller as string,
        buyer: parsed.args.buyer as string,
        orderId: (parsed.args.orderId as bigint).toString(),
        tokenAmount: (parsed.args.amount as bigint).toString(),
        pricePerToken: "0",
        totalUSDC: (parsed.args.usdcTotal as bigint).toString(),
        wavyScore: wavyScores.get(log.transactionHash.toLowerCase()) ?? 0,
      } satisfies TradeEvent;
    })
  );

  return events.filter(Boolean) as TradeEvent[];
}

export async function submitExecuteOrder(orderId: string): Promise<string> {
  const wallet = getRelayerWallet();
  const orderBook = getOrderBook(wallet);
  const tx = await (orderBook.executeOrder as Function)(BigInt(orderId));
  await tx.wait();
  return tx.hash as string;
}
