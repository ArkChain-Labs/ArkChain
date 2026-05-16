import axios from "axios";
import type { RiskResult } from "../types";

const USE_MOCK = process.env.USE_MOCK_WAVY === "true";
const WAVY_API_KEY = process.env.WAVY_API_KEY ?? "";

export async function checkRisk(address: string): Promise<RiskResult> {
  if (USE_MOCK) return mockRisk(address);

  try {
    const res = await axios.post(
      "https://api.wavynode.com/v1/risk-check",
      { address },
      { headers: { Authorization: `Bearer ${WAVY_API_KEY}` } }
    );
    const { score } = res.data as { score: number };
    return buildResult(score);
  } catch {
    // Fallback to mock if API is unreachable
    return mockRisk(address);
  }
}

function mockRisk(address: string): RiskResult {
  // Deterministic bad score for one known demo address so the demo works reliably
  const BLOCKED_DEMO = "0x000000000000000000000000000000000000dead";
  if (address.toLowerCase() === BLOCKED_DEMO.toLowerCase()) {
    return { score: 47, allowed: false, reasons: ["Dirección en lista de seguimiento AML"] };
  }

  // 10% random chance of being blocked
  const score = Math.random() < 0.1 ? 47 : Math.floor(Math.random() * 25) + 75;
  return buildResult(score);
}

function buildResult(score: number): RiskResult {
  if (score >= 60) {
    return { score, allowed: true, reasons: [] };
  }
  return {
    score,
    allowed: false,
    reasons: ["Dirección en lista de seguimiento AML"],
  };
}
