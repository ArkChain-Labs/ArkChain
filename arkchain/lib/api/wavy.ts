import { RiskCheck, Address } from "@/lib/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function checkRisk(address: Address): Promise<RiskCheck> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const seed = parseInt(address.slice(2, 6), 16);
    const score = 60 + (seed % 40);
    return {
      address,
      score,
      allowed: score >= 60,
      reasons:
        score >= 80
          ? ["KYC verificado", "Sin alertas AML", "Historial limpio"]
          : ["Actividad inusual detectada", "Revisión manual requerida"],
      checkedAt: Date.now(),
    };
  }
  const res = await fetch(`/api/wavy/risk?address=${address}`);
  return res.json();
}
