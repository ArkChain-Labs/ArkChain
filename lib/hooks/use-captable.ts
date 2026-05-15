import { useQuery } from "@tanstack/react-query";
import { getCapTable, getCorporateEvents, getCompanyStats } from "@/lib/api/captable";

export function useCapTable(companyId: string) {
  return useQuery({
    queryKey: ["captable", companyId],
    queryFn: () => getCapTable(companyId),
  });
}

export function useCorporateEvents(companyId: string) {
  return useQuery({
    queryKey: ["corporate-events", companyId],
    queryFn: () => getCorporateEvents(companyId),
  });
}

export function useCompanyStats(companyId: string) {
  return useQuery({
    queryKey: ["company-stats", companyId],
    queryFn: () => getCompanyStats(companyId),
  });
}
