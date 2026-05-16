import type { NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:4000";
const AUDITOR_KEY = process.env.AUDITOR_API_KEY ?? "arkchain-auditor-2026";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  try {
    const res = await fetch(`${BACKEND}/api/transactions?${params.toString()}`, {
      headers: { "x-auditor-key": AUDITOR_KEY },
    });
    const data = await res.json();
    return Response.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch {
    return Response.json([], { status: 200 });
  }
}
