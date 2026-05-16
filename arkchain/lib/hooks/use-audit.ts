import { useQuery } from "@tanstack/react-query";
import { getAuditEvents, AuditFilters } from "@/lib/api/audit";

export function useAuditEvents(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: ["audit-events", filters],
    queryFn: () => getAuditEvents(filters),
  });
}
