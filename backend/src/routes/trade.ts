import { Router } from "express";
import { checkRisk } from "../services/wavy";
import { submitExecuteOrder, saveWavyScore } from "../services/blockchain";
import type { SubmitTradeBody } from "../types";

const router = Router();

router.post("/", async (req, res) => {
  const { orderId, buyerAddress } = req.body as SubmitTradeBody;
  if (!orderId || !buyerAddress) {
    res.status(400).json({ error: "orderId and buyerAddress required" });
    return;
  }

  const risk = await checkRisk(buyerAddress);
  if (!risk.allowed) {
    res.status(403).json({
      error: "Trade blocked by Wavy Node",
      score: risk.score,
      reasons: risk.reasons,
    });
    return;
  }

  try {
    const txHash = await submitExecuteOrder(orderId);
    saveWavyScore(txHash, risk.score);
    res.json({ txHash, wavyScore: risk.score });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
