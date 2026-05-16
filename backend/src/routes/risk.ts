import { Router } from "express";
import { checkRisk } from "../services/wavy";
import type { RiskCheckBody } from "../types";

const router = Router();

router.post("/", async (req, res) => {
  const { address } = req.body as RiskCheckBody;
  if (!address) {
    res.status(400).json({ error: "address required" });
    return;
  }
  const result = await checkRisk(address);
  res.json(result);
});

export default router;
