import { useQuery } from "@tanstack/react-query";
import { getPortfolio } from "@/lib/api/portfolio";
import { Address } from "@/lib/types";

export function usePortfolio(address: Address | undefined) {
  return useQuery({
    queryKey: ["portfolio", address],
    queryFn: () => getPortfolio(address!),
    enabled: !!address,
  });
}
