import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOpenOrders, getMyOrders, createOrder, executeOrder } from "@/lib/api/orders";
import { Address, CreateOrderInput } from "@/lib/types";

export function useOrders(companyId?: string) {
  return useQuery({
    queryKey: ["orders", companyId],
    queryFn: () => getOpenOrders(companyId),
  });
}

export function useMyOrders(address: Address | undefined) {
  return useQuery({
    queryKey: ["my-orders", address],
    queryFn: () => getMyOrders(address!),
    enabled: !!address,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, seller }: { input: CreateOrderInput; seller: Address }) =>
      createOrder(input, seller),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
}

export function useExecuteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, buyer }: { orderId: string; buyer: Address }) =>
      executeOrder(orderId, buyer),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
