import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/features/admin/customers/services/customerService";

// ─── Query keys ───────────────────────────────────────────────────────────────
const customerKeys = {
  all: ["admin" , "customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params?: object) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

// ─── Params type ──────────────────────────────────────────────────────────────
interface UseCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  tier?: string;
}

// ─── useCustomers ─────────────────────────────────────────────────────────────
export const useCustomers = (params?: UseCustomersParams) => {
  const query = useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => {
      const apiParams = Object.fromEntries(
        Object.entries({
          page: params?.page,
          limit: params?.limit,
          search: params?.search || undefined,
          tier: params?.tier || undefined,
        }).filter(([, v]) => v !== undefined),
      );
      return customerService.getCustomers(apiParams);
    },
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  return {
    customers: query.data?.customers ?? [],
    meta: query.data?.meta,
    totalPages: query.data?.meta?.totalPages ?? 1,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    isEmpty: !query.isPending && (query.data?.customers?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};
