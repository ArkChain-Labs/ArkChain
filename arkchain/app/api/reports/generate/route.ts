import type { NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:4000";
const AUDITOR_KEY = process.env.AUDITOR_API_KEY ?? "arkchain-auditor-2026";

export async function POST(req: NextRequest) {
  const config = await req.json();

  const params = new URLSearchParams();
  if (config.from) params.set("from", String(config.from));
  if (config.to) params.set("to", String(config.to));

  const res = await fetch(
    `${BACKEND}/api/generate-report?${params.toString()}`,
    { headers: { "x-auditor-key": AUDITOR_KEY } }
  );

  const csv = await res.text();
  return new Response(csv, {
    status: res.status,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": res.headers.get("Content-Disposition") ?? 'attachment; filename="report.csv"',
    },
  });
}
