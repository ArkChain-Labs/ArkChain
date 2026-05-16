import type { NextRequest } from "next/server";

// Portfolio data lives off-chain (encrypted eERC balances).
// Returns empty until a dedicated indexer is implemented.
export async function GET(_req: NextRequest) {
  return Response.json([]);
}
