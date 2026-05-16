import { Router } from "express";
import { fetchTradeEvents } from "../services/blockchain";

const router = Router();

const AUDITOR_KEY = process.env.AUDITOR_API_KEY ?? "arkchain-auditor-2026";

function toCSV(events: Awaited<ReturnType<typeof fetchTradeEvents>>): string {
  const header =
    "txHash,blockNumber,timestamp,seller,buyer,orderId,tokenAmount,pricePerToken,totalUSDC,wavyScore";
  const rows = events.map((e) =>
    [
      e.txHash,
      e.blockNumber,
      e.timestamp,
      e.seller,
      e.buyer,
      e.orderId,
      e.tokenAmount,
      e.pricePerToken,
      e.totalUSDC,
      e.wavyScore,
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

router.get("/", async (req, res) => {
  const key = req.headers["x-auditor-key"];
  if (key !== AUDITOR_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { from, to } = req.query;
  const fromBlock = from ? Number(from) : 0;

  try {
    let events = await fetchTradeEvents(fromBlock);

    if (to) {
      const toBlock = Number(to);
      events = events.filter((e) => e.blockNumber <= toBlock);
    }

    const csv = toCSV(events);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="arkchain-report-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
