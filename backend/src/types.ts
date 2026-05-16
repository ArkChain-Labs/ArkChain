export interface RiskResult {
  score: number;
  allowed: boolean;
  reasons: string[];
}

export interface TradeEvent {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  seller: string;
  buyer: string;
  orderId: string;
  tokenAmount: string;
  pricePerToken: string;
  totalUSDC: string;
  wavyScore: number;
}

export interface SubmitTradeBody {
  orderId: string;
  buyerAddress: string;
}

export interface RiskCheckBody {
  address: string;
}
