import type { NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/orders/[orderId]/execute">
) {
  const { orderId } = await ctx.params;
  const { buyer } = await req.json();

  const res = await fetch(`${BACKEND}/api/submit-trade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, buyerAddress: buyer }),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
