import { Order, Address, CreateOrderInput } from "@/lib/types";
import { mockOrders } from "@/lib/mocks/seed";
import { mockCompanies, getCompany } from "@/lib/mocks/companies";
import {
  CONTRACT_ADDRESSES,
  ORDER_BOOK_ABI,
  ORDER_POSTED_EVENT,
  ORDER_EXECUTED_EVENT,
  ORDER_CANCELLED_EVENT,
  EERC20_TO_COMPANY_ID,
  MXN_PER_USDC,
  fujiClient,
  getDeployFromBlock,
} from "@/lib/contracts";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

let localOrders = [...mockOrders];

type WriteContractFn = (config: {
  address: `0x${string}`;
  abi: readonly object[];
  functionName: string;
  args?: readonly unknown[];
}) => Promise<`0x${string}`>;

export async function getOpenOrders(companyId?: string): Promise<Order[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return localOrders.filter((o) =>
      companyId ? o.companyId === companyId : true
    );
  }

  const fromBlock = await getDeployFromBlock();

  const [postedLogs, cancelledLogs, executedLogs] = await Promise.all([
    fujiClient.getLogs({
      address: CONTRACT_ADDRESSES.OrderBook,
      event: ORDER_POSTED_EVENT,
      fromBlock,
      toBlock: "latest",
    }),
    fujiClient.getLogs({
      address: CONTRACT_ADDRESSES.OrderBook,
      event: ORDER_CANCELLED_EVENT,
      fromBlock,
      toBlock: "latest",
    }),
    fujiClient.getLogs({
      address: CONTRACT_ADDRESSES.OrderBook,
      event: ORDER_EXECUTED_EVENT,
      fromBlock,
      toBlock: "latest",
    }),
  ]);

  const inactiveIds = new Set([
    ...cancelledLogs.map((l) => l.args.orderId?.toString()),
    ...executedLogs.map((l) => l.args.orderId?.toString()),
  ]);

  const orders: Order[] = [];

  for (const log of postedLogs) {
    const { orderId, seller, eERC20, amount, pricePerToken } = log.args;
    if (!orderId || inactiveIds.has(orderId.toString())) continue;

    const cid =
      EERC20_TO_COMPANY_ID[(eERC20 ?? "").toLowerCase()] ?? "fintechmx";
    if (companyId && cid !== companyId) continue;

    const company = getCompany(cid) ?? mockCompanies[0];
    // pricePerToken is stored as USDC with 6 decimals; convert to MXN
    const pricePerTokenMXN =
      (Number(pricePerToken ?? 0n) / 1_000_000) * MXN_PER_USDC;
    const tokensForSale = amount ?? 0n;

    orders.push({
      orderId: orderId.toString(),
      companyId: cid,
      company,
      seller: (seller ?? "0x0") as Address,
      tokensForSale,
      pricePerTokenMXN,
      totalMXN: Number(tokensForSale) * pricePerTokenMXN,
      status: "open",
      createdAt: Date.now(),
    });
  }

  return orders;
}

export async function getMyOrders(address: Address): Promise<Order[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return localOrders.filter((o) => o.seller === address);
  }

  const fromBlock = await getDeployFromBlock();

  const [postedLogs, cancelledLogs, executedLogs] = await Promise.all([
    fujiClient.getLogs({
      address: CONTRACT_ADDRESSES.OrderBook,
      event: ORDER_POSTED_EVENT,
      args: { seller: address },
      fromBlock,
      toBlock: "latest",
    }),
    fujiClient.getLogs({
      address: CONTRACT_ADDRESSES.OrderBook,
      event: ORDER_CANCELLED_EVENT,
      fromBlock,
      toBlock: "latest",
    }),
    fujiClient.getLogs({
      address: CONTRACT_ADDRESSES.OrderBook,
      event: ORDER_EXECUTED_EVENT,
      fromBlock,
      toBlock: "latest",
    }),
  ]);

  const inactiveIds = new Set([
    ...cancelledLogs.map((l) => l.args.orderId?.toString()),
    ...executedLogs.map((l) => l.args.orderId?.toString()),
  ]);

  const orders: Order[] = [];

  for (const log of postedLogs) {
    const { orderId, seller, eERC20, amount, pricePerToken } = log.args;
    if (!orderId || inactiveIds.has(orderId.toString())) continue;

    const cid =
      EERC20_TO_COMPANY_ID[(eERC20 ?? "").toLowerCase()] ?? "fintechmx";
    const company = getCompany(cid) ?? mockCompanies[0];
    const pricePerTokenMXN =
      (Number(pricePerToken ?? 0n) / 1_000_000) * MXN_PER_USDC;
    const tokensForSale = amount ?? 0n;

    orders.push({
      orderId: orderId.toString(),
      companyId: cid,
      company,
      seller: (seller ?? "0x0") as Address,
      tokensForSale,
      pricePerTokenMXN,
      totalMXN: Number(tokensForSale) * pricePerTokenMXN,
      status: "open",
      createdAt: Date.now(),
    });
  }

  return orders;
}

export async function createOrder(
  input: CreateOrderInput,
  seller: Address,
  writeContractAsync?: WriteContractFn
): Promise<Order> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    const company = mockCompanies.find((c) => c.id === input.companyId);
    if (!company) throw new Error("Company not found");
    const newOrder: Order = {
      orderId: `ord-${Date.now()}`,
      companyId: input.companyId,
      company,
      seller,
      tokensForSale: input.tokensForSale,
      pricePerTokenMXN: input.pricePerTokenMXN,
      totalMXN: Number(input.tokensForSale) * input.pricePerTokenMXN,
      status: "open",
      createdAt: Date.now(),
      wavyScorePreview: 88,
    };
    localOrders = [newOrder, ...localOrders];
    return newOrder;
  }

  if (!writeContractAsync) throw new Error("writeContractAsync is required");

  const eERC20 = CONTRACT_ADDRESSES.EncryptedERC;
  // Use timestamp as orderId — unique enough for hackathon
  const orderId = BigInt(Date.now());
  const tokenId = 0n;
  const amount = input.tokensForSale;
  // Convert MXN price → USDC with 6 decimals
  const pricePerToken = BigInt(
    Math.round((input.pricePerTokenMXN / MXN_PER_USDC) * 1_000_000)
  );

  await writeContractAsync({
    address: CONTRACT_ADDRESSES.OrderBook,
    abi: ORDER_BOOK_ABI,
    functionName: "postOrder",
    args: [orderId, eERC20, tokenId, amount, pricePerToken],
  });

  const company = getCompany(input.companyId) ?? mockCompanies[0];
  return {
    orderId: orderId.toString(),
    companyId: input.companyId,
    company,
    seller,
    tokensForSale: input.tokensForSale,
    pricePerTokenMXN: input.pricePerTokenMXN,
    totalMXN: Number(input.tokensForSale) * input.pricePerTokenMXN,
    status: "open",
    createdAt: Date.now(),
  };
}

export async function executeOrder(
  orderId: string,
  buyer: Address
): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    localOrders = localOrders.map((o) =>
      o.orderId === orderId ? { ...o, status: "filled" as const } : o
    );
    return { success: true };
  }
  const res = await fetch(`/api/orders/${orderId}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ buyer }),
  });
  return res.json();
}
