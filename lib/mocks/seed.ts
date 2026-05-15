import { Address, AuditEvent, CapTableEntry, CorporateEvent, Holding, Order } from "@/lib/types";
import { mockCompanies, getCompany } from "./companies";

export { mockCompanies };

const now = Date.now();
const DAY = 86_400_000;

// 20 mock investor addresses with Mexican names
export const mockInvestors: { address: Address; name: string }[] = [
  { address: "0xA1B2C3D4E5F6a1b2c3d4e5f6A1B2C3D4E5F6A1B2", name: "María Pérez García" },
  { address: "0xB2C3D4E5F6A7b2c3d4e5f6a7B2C3D4E5F6A7B2C3", name: "Juan López Martínez" },
  { address: "0xC3D4E5F6A7B8c3d4e5f6a7b8C3D4E5F6A7B8C3D4", name: "Ana González Ruiz" },
  { address: "0xD4E5F6A7B8C9d4e5f6a7b8c9D4E5F6A7B8C9D4E5", name: "Carlos Hernández Torres" },
  { address: "0xE5F6A7B8C9D0e5f6a7b8c9d0E5F6A7B8C9D0E5F6", name: "Laura Rodríguez Sánchez" },
  { address: "0xF6A7B8C9D0E1f6a7b8c9d0e1F6A7B8C9D0E1F6A7", name: "Roberto Ramírez Flores" },
  { address: "0x07A8B9C0D1E2f7a8b9c0d1e207A8B9C0D1E2F7A8", name: "Sofia Morales Jiménez" },
  { address: "0x18B9C0D1E2F308b9c0d1e2f318B9C0D1E2F3A8B9", name: "Diego Vargas Castillo" },
  { address: "0x29C0D1E2F3A4c9c0d1e2f3a429C0D1E2F3A4C9C0", name: "Valentina Cruz Medina" },
  { address: "0x3AD1E2F3A4B5d1e2f3a4b53AD1E2F3A4B5D1E2F3", name: "Alejandro Ortiz Reyes" },
  { address: "0x4BE2F3A4B5C6e2f3a4b5c64BE2F3A4B5C6E2F3A4", name: "Camila Mendoza Vega" },
  { address: "0x5CF3A4B5C6D7f3a4b5c6d75CF3A4B5C6D7F3A4B5", name: "Fernando Gutiérrez Luna" },
  { address: "0x6DA4B5C6D7E8a4b5c6d7e86DA4B5C6D7E8A4B5C6", name: "Isabella Torres Núñez" },
  { address: "0x7EB5C6D7E8F9b5c6d7e8f97EB5C6D7E8F9B5C6D7", name: "Marcos Ávila Serrano" },
  { address: "0x8FC6D7E8F9A0c6d7e8f9a08FC6D7E8F9A0C6D7E8", name: "Natalia Romero Delgado" },
  { address: "0x90D7E8F9A0B1d7e8f9a0b190D7E8F9A0B1D7E8F9", name: "Pablo Jiménez Aguilar" },
  { address: "0xA1E8F9A0B1C2e8f9a0b1c2A1E8F9A0B1C2E8F9A0", name: "Renata Herrera Cabrera" },
  { address: "0xB2F9A0B1C2D3f9a0b1c2d3B2F9A0B1C2D3F9A0B1", name: "Santiago Molina Fuentes" },
  { address: "0xC3A0B1C2D3E4a0b1c2d3e4C3A0B1C2D3E4A0B1C2", name: "Valeria Estrada Ponce" },
  { address: "0xDEFAULT000000000000000000000000000000000A", name: "Inversionista Demo" },
];

export const DEFAULT_ADDRESS: Address = "0xDEFAULT000000000000000000000000000000000A";

// Mock holdings per address (default investor has 3 positions)
export const mockHoldings: Record<string, Holding[]> = {
  "0xDEFAULT000000000000000000000000000000000A": [
    {
      companyId: "fintechmx",
      company: mockCompanies[0],
      tokensOwned: BigInt(1_200),
      estimatedValueMXN: 294_000,
      pnl30dPct: 8.4,
      encrypted: true,
    },
    {
      companyId: "logipay",
      company: mockCompanies[1],
      tokensOwned: BigInt(500),
      estimatedValueMXN: 205_000,
      pnl30dPct: -3.1,
      encrypted: true,
    },
    {
      companyId: "agrotech",
      company: mockCompanies[2],
      tokensOwned: BigInt(800),
      estimatedValueMXN: 142_400,
      pnl30dPct: 14.7,
      encrypted: true,
    },
  ],
};

// Open orders in the marketplace
export const mockOrders: Order[] = [
  {
    orderId: "ord-001",
    companyId: "fintechmx",
    company: mockCompanies[0],
    seller: mockInvestors[0].address,
    sellerName: mockInvestors[0].name,
    tokensForSale: BigInt(300),
    pricePerTokenMXN: 248,
    totalMXN: 74_400,
    status: "open",
    createdAt: now - 2 * DAY,
    wavyScorePreview: 91,
  },
  {
    orderId: "ord-002",
    companyId: "logipay",
    company: mockCompanies[1],
    seller: mockInvestors[1].address,
    sellerName: mockInvestors[1].name,
    tokensForSale: BigInt(150),
    pricePerTokenMXN: 415,
    totalMXN: 62_250,
    status: "open",
    createdAt: now - 5 * DAY,
    wavyScorePreview: 87,
  },
  {
    orderId: "ord-003",
    companyId: "fintechmx",
    company: mockCompanies[0],
    seller: mockInvestors[2].address,
    sellerName: mockInvestors[2].name,
    tokensForSale: BigInt(500),
    pricePerTokenMXN: 240,
    totalMXN: 120_000,
    status: "open",
    createdAt: now - 1 * DAY,
    wavyScorePreview: 94,
  },
  {
    orderId: "ord-004",
    companyId: "agrotech",
    company: mockCompanies[2],
    seller: mockInvestors[3].address,
    sellerName: mockInvestors[3].name,
    tokensForSale: BigInt(200),
    pricePerTokenMXN: 182,
    totalMXN: 36_400,
    status: "open",
    createdAt: now - 3 * DAY,
    wavyScorePreview: 78,
  },
  {
    orderId: "ord-005",
    companyId: "eduplus",
    company: mockCompanies[3],
    seller: mockInvestors[4].address,
    sellerName: mockInvestors[4].name,
    tokensForSale: BigInt(100),
    pricePerTokenMXN: 325,
    totalMXN: 32_500,
    status: "blocked",
    createdAt: now - 10 * DAY,
    wavyScorePreview: 47,
  },
  {
    orderId: "ord-006",
    companyId: "saluddigital",
    company: mockCompanies[4],
    seller: mockInvestors[5].address,
    sellerName: mockInvestors[5].name,
    tokensForSale: BigInt(400),
    pricePerTokenMXN: 198,
    totalMXN: 79_200,
    status: "open",
    createdAt: now - 4 * DAY,
    wavyScorePreview: 89,
  },
];

// Cap table for FintechMX
export const mockCapTable: CapTableEntry[] = [
  { holder: mockInvestors[0].address, holderName: "Equipo Fundador", category: "founder", tokens: BigInt(350_000), pctOwnership: 35 },
  { holder: mockInvestors[1].address, holderName: "DILA Capital", category: "vc", tokens: BigInt(200_000), pctOwnership: 20 },
  { holder: mockInvestors[2].address, holderName: "Arkangeles Pool A", category: "retail", tokens: BigInt(180_000), pctOwnership: 18 },
  { holder: mockInvestors[3].address, holderName: "Reserva Estratégica", category: "reserve", tokens: BigInt(150_000), pctOwnership: 15 },
  { holder: mockInvestors[4].address, holderName: "Treasury", category: "treasury", tokens: BigInt(120_000), pctOwnership: 12 },
];

// Corporate events for FintechMX
export const mockCorporateEvents: CorporateEvent[] = [
  { eventId: "ev-001", companyId: "fintechmx", type: "assembly", title: "Asamblea General Ordinaria", detail: "Revisión de resultados Q1 2026 y aprobación de dividendos.", date: now + 28 * DAY, status: "upcoming" },
  { eventId: "ev-002", companyId: "fintechmx", type: "valuation", title: "Actualización de valuación", detail: "Nueva valuación post-Serie A: $45M USD.", date: now - 15 * DAY, status: "completed" },
  { eventId: "ev-003", companyId: "fintechmx", type: "dividend", title: "Distribución de dividendos Q4 2025", detail: "$0.18 MXN por token. Pago en MXNB.", date: now - 45 * DAY, status: "completed" },
  { eventId: "ev-004", companyId: "fintechmx", type: "valuation", title: "Auditoría contable anual", detail: "Firma: Deloitte México. Dictamen limpio.", date: now - 90 * DAY, status: "completed" },
];

// Audit events (20 transactions, 1 blocked)
export const mockAuditEvents: AuditEvent[] = [
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000001", blockNumber: 24_891_001, timestamp: now - 1 * DAY, from: mockInvestors[0].address, fromName: mockInvestors[0].name, to: mockInvestors[1].address, toName: mockInvestors[1].name, companyId: "fintechmx", company: mockCompanies[0], tokens: BigInt(200), pricePerTokenMXN: 248, totalMXN: 49_600, wavyScore: 91, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000002", blockNumber: 24_891_050, timestamp: now - 2 * DAY, from: mockInvestors[2].address, fromName: mockInvestors[2].name, to: mockInvestors[3].address, toName: mockInvestors[3].name, companyId: "logipay", company: mockCompanies[1], tokens: BigInt(100), pricePerTokenMXN: 412, totalMXN: 41_200, wavyScore: 88, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000003", blockNumber: 24_891_100, timestamp: now - 2 * DAY, from: mockInvestors[4].address, fromName: mockInvestors[4].name, to: mockInvestors[5].address, toName: mockInvestors[5].name, companyId: "agrotech", company: mockCompanies[2], tokens: BigInt(350), pricePerTokenMXN: 180, totalMXN: 63_000, wavyScore: 47, wavyAllowed: false, status: "blocked" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000004", blockNumber: 24_891_200, timestamp: now - 3 * DAY, from: mockInvestors[6].address, fromName: mockInvestors[6].name, to: mockInvestors[7].address, toName: mockInvestors[7].name, companyId: "fintechmx", company: mockCompanies[0], tokens: BigInt(150), pricePerTokenMXN: 245, totalMXN: 36_750, wavyScore: 95, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000005", blockNumber: 24_891_350, timestamp: now - 4 * DAY, from: mockInvestors[8].address, fromName: mockInvestors[8].name, to: mockInvestors[9].address, toName: mockInvestors[9].name, companyId: "eduplus", company: mockCompanies[3], tokens: BigInt(80), pricePerTokenMXN: 320, totalMXN: 25_600, wavyScore: 82, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000006", blockNumber: 24_891_500, timestamp: now - 5 * DAY, from: mockInvestors[10].address, fromName: mockInvestors[10].name, to: mockInvestors[11].address, toName: mockInvestors[11].name, companyId: "saluddigital", company: mockCompanies[4], tokens: BigInt(500), pricePerTokenMXN: 195, totalMXN: 97_500, wavyScore: 79, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000007", blockNumber: 24_891_700, timestamp: now - 7 * DAY, from: mockInvestors[12].address, fromName: mockInvestors[12].name, to: mockInvestors[13].address, toName: mockInvestors[13].name, companyId: "fintechmx", company: mockCompanies[0], tokens: BigInt(400), pricePerTokenMXN: 242, totalMXN: 96_800, wavyScore: 91, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000008", blockNumber: 24_891_900, timestamp: now - 9 * DAY, from: mockInvestors[14].address, fromName: mockInvestors[14].name, to: mockInvestors[15].address, toName: mockInvestors[15].name, companyId: "logipay", company: mockCompanies[1], tokens: BigInt(200), pricePerTokenMXN: 408, totalMXN: 81_600, wavyScore: 87, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000009", blockNumber: 24_892_100, timestamp: now - 12 * DAY, from: mockInvestors[16].address, fromName: mockInvestors[16].name, to: mockInvestors[17].address, toName: mockInvestors[17].name, companyId: "agrotech", company: mockCompanies[2], tokens: BigInt(600), pricePerTokenMXN: 175, totalMXN: 105_000, wavyScore: 93, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc123000000000000000000000000000000000000000000000000000000000a", blockNumber: 24_892_300, timestamp: now - 14 * DAY, from: mockInvestors[18].address, fromName: mockInvestors[18].name, to: mockInvestors[0].address, toName: mockInvestors[0].name, companyId: "eduplus", company: mockCompanies[3], tokens: BigInt(120), pricePerTokenMXN: 318, totalMXN: 38_160, wavyScore: 85, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc123000000000000000000000000000000000000000000000000000000000b", blockNumber: 24_892_500, timestamp: now - 18 * DAY, from: mockInvestors[1].address, fromName: mockInvestors[1].name, to: mockInvestors[3].address, toName: mockInvestors[3].name, companyId: "fintechmx", company: mockCompanies[0], tokens: BigInt(250), pricePerTokenMXN: 238, totalMXN: 59_500, wavyScore: 90, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc123000000000000000000000000000000000000000000000000000000000c", blockNumber: 24_892_800, timestamp: now - 22 * DAY, from: mockInvestors[5].address, fromName: mockInvestors[5].name, to: mockInvestors[7].address, toName: mockInvestors[7].name, companyId: "saluddigital", company: mockCompanies[4], tokens: BigInt(300), pricePerTokenMXN: 192, totalMXN: 57_600, wavyScore: 76, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc123000000000000000000000000000000000000000000000000000000000d", blockNumber: 24_893_100, timestamp: now - 27 * DAY, from: mockInvestors[9].address, fromName: mockInvestors[9].name, to: mockInvestors[11].address, toName: mockInvestors[11].name, companyId: "logipay", company: mockCompanies[1], tokens: BigInt(175), pricePerTokenMXN: 400, totalMXN: 70_000, wavyScore: 88, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc123000000000000000000000000000000000000000000000000000000000e", blockNumber: 24_893_400, timestamp: now - 33 * DAY, from: mockInvestors[13].address, fromName: mockInvestors[13].name, to: mockInvestors[15].address, toName: mockInvestors[15].name, companyId: "fintechmx", company: mockCompanies[0], tokens: BigInt(320), pricePerTokenMXN: 232, totalMXN: 74_240, wavyScore: 92, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc123000000000000000000000000000000000000000000000000000000000f", blockNumber: 24_893_700, timestamp: now - 40 * DAY, from: mockInvestors[17].address, fromName: mockInvestors[17].name, to: mockInvestors[19].address, toName: mockInvestors[19].name, companyId: "agrotech", company: mockCompanies[2], tokens: BigInt(450), pricePerTokenMXN: 170, totalMXN: 76_500, wavyScore: 81, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000010", blockNumber: 24_894_000, timestamp: now - 48 * DAY, from: mockInvestors[19].address, fromName: mockInvestors[19].name, to: mockInvestors[2].address, toName: mockInvestors[2].name, companyId: "eduplus", company: mockCompanies[3], tokens: BigInt(90), pricePerTokenMXN: 310, totalMXN: 27_900, wavyScore: 83, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000011", blockNumber: 24_894_300, timestamp: now - 56 * DAY, from: mockInvestors[4].address, fromName: mockInvestors[4].name, to: mockInvestors[6].address, toName: mockInvestors[6].name, companyId: "saluddigital", company: mockCompanies[4], tokens: BigInt(700), pricePerTokenMXN: 188, totalMXN: 131_600, wavyScore: 77, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000012", blockNumber: 24_894_600, timestamp: now - 65 * DAY, from: mockInvestors[8].address, fromName: mockInvestors[8].name, to: mockInvestors[10].address, toName: mockInvestors[10].name, companyId: "fintechmx", company: mockCompanies[0], tokens: BigInt(180), pricePerTokenMXN: 228, totalMXN: 41_040, wavyScore: 94, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000013", blockNumber: 24_894_900, timestamp: now - 75 * DAY, from: mockInvestors[12].address, fromName: mockInvestors[12].name, to: mockInvestors[14].address, toName: mockInvestors[14].name, companyId: "logipay", company: mockCompanies[1], tokens: BigInt(250), pricePerTokenMXN: 395, totalMXN: 98_750, wavyScore: 86, wavyAllowed: true, status: "executed" },
  { txHash: "0xabc1230000000000000000000000000000000000000000000000000000000014", blockNumber: 24_895_200, timestamp: now - 88 * DAY, from: mockInvestors[16].address, fromName: mockInvestors[16].name, to: mockInvestors[18].address, toName: mockInvestors[18].name, companyId: "agrotech", company: mockCompanies[2], tokens: BigInt(520), pricePerTokenMXN: 165, totalMXN: 85_800, wavyScore: 89, wavyAllowed: true, status: "executed" },
];
