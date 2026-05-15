import { Company } from "@/lib/types";

export const mockCompanies: Company[] = [
  {
    id: "fintechmx",
    name: "FintechMX",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=FintechMX&backgroundColor=0F3D2E&textColor=F5F0E6",
    country: "MX",
    sector: "Fintech",
    totalSupply: BigInt(1_000_000),
    lastTradePriceMXN: 245,
  },
  {
    id: "logipay",
    name: "LogiPay",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=LogiPay&backgroundColor=A56A2C&textColor=F5F0E6",
    country: "MX",
    sector: "Logística & Fintech",
    totalSupply: BigInt(500_000),
    lastTradePriceMXN: 410,
  },
  {
    id: "agrotech",
    name: "AgroTech MX",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=AgroTech&backgroundColor=5C7C2A&textColor=F5F0E6",
    country: "MX",
    sector: "Agritech",
    totalSupply: BigInt(750_000),
    lastTradePriceMXN: 178,
  },
  {
    id: "eduplus",
    name: "EduPlus",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=EduPlus&backgroundColor=3D4A4F&textColor=F5F0E6",
    country: "CO",
    sector: "Edtech",
    totalSupply: BigInt(300_000),
    lastTradePriceMXN: 320,
  },
  {
    id: "saluddigital",
    name: "SaludDigital",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=SaludDigital&backgroundColor=A8421F&textColor=F5F0E6",
    country: "AR",
    sector: "Healthtech",
    totalSupply: BigInt(600_000),
    lastTradePriceMXN: 195,
  },
];

export function getCompany(id: string): Company | undefined {
  return mockCompanies.find((c) => c.id === id);
}
