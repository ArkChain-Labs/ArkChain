import { Order, Address, CreateOrderInput } from "@/lib/types";
import { mockOrders } from "@/lib/mocks/seed";
import { mockCompanies } from "@/lib/mocks/companies";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

let localOrders = [...mockOrders];

export async function getOpenOrders(companyId?: string): Promise<Order[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return localOrders.filter((o) =>
      companyId ? o.companyId === companyId : true
    );
  }
  const url = companyId ? `/api/orders?companyId=${companyId}` : "/api/orders";
  const res = await fetch(url);
  return res.json();
}

export async function getMyOrders(address: Address): Promise<Order[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return localOrders.filter((o) => o.seller === address);
  }
  const res = await fetch(`/api/orders/mine?address=${address}`);
  return res.json();
}

export async function createOrder(
  input: CreateOrderInput,
  seller: Address
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
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, seller }),
  });
  return res.json();
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
