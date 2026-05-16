export type Address = `0x${string}`;
export type UserRole = "investor" | "issuer" | "regulator";

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  country: "MX" | "BR" | "AR" | "CO" | "CL" | "PE";
  sector: string;
  totalSupply: bigint;
  lastTradePriceMXN: number;
}

export interface Holding {
  companyId: string;
  company: Company;
  tokensOwned: bigint;
  estimatedValueMXN: number;
  pnl30dPct: number;
  encrypted: boolean;
}

export interface Order {
  orderId: string;
  companyId: string;
  company: Company;
  seller: Address;
  sellerName?: string;
  tokensForSale: bigint;
  pricePerTokenMXN: number;
  totalMXN: number;
  status: "open" | "filled" | "cancelled" | "blocked";
  createdAt: number;
  wavyScorePreview?: number;
}

export interface RiskCheck {
  address: Address;
  score: number;
  allowed: boolean;
  reasons: string[];
  checkedAt: number;
}

export interface AuditEvent {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  from: Address;
  fromName: string;
  to: Address;
  toName: string;
  companyId: string;
  company: Company;
  tokens: bigint;
  pricePerTokenMXN: number;
  totalMXN: number;
  wavyScore: number;
  wavyAllowed: boolean;
  status: "executed" | "blocked";
}

export interface CapTableEntry {
  holder: Address;
  holderName: string;
  category: "founder" | "vc" | "retail" | "reserve" | "treasury";
  tokens: bigint;
  pctOwnership: number;
}

export interface CorporateEvent {
  eventId: string;
  companyId: string;
  type: "assembly" | "dividend" | "valuation" | "split";
  title: string;
  detail: string;
  date: number;
  status: "upcoming" | "completed" | "cancelled";
}

export interface ReportConfig {
  type:
    | "quarterly-secondary"
    | "aml-summary"
    | "point-audit"
    | "wavy-compliance";
  from: number;
  to: number;
  jurisdictions: Array<"MX" | "BR" | "AR" | "CO" | "CL" | "PE">;
  platforms: string[];
  format: "csv" | "pdf" | "xbrl";
}

export interface CreateOrderInput {
  companyId: string;
  tokensForSale: bigint;
  pricePerTokenMXN: number;
}
