import { Router } from "express";
import { fetchTradeEvents } from "../services/blockchain";

const router = Router();

const AUDITOR_KEY = process.env.AUDITOR_API_KEY ?? "arkchain-auditor-2026";

router.get("/", async (req, res) => {
  const key = req.headers["x-auditor-key"];
  if (key !== AUDITOR_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const fromBlock = req.query.fromBlock ? Number(req.query.fromBlock) : 0;

  try {
    const events = await fetchTradeEvents(fromBlock);
    res.json(events);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
