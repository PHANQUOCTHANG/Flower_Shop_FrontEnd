import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignService } from "../services/campaignService";
import { AdminCampaignsParams, CreateCampaignDto, UpdateCampaignDto } from "../types";
import { SaleCampaign } from "@/types/campaign";

export const campaignKeys = {
  all: ["admin", "campaigns"] as const,
  lists: () => [...campaignKeys.all, "list"] as const,
  list: (params?: object) => [...campaignKeys.lists(), params] as const,
  details: () => [...campaignKeys.all, "detail"] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
};

// Hook lấy danh sách chiến dịch (phân trang/search/filter)
export const useCampaigns = (params?: AdminCampaignsParams) => {
  const query = useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: () => campaignService.getCampaigns(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  return {
    campaigns: query.data?.campaigns ?? [],
    meta: query.data?.meta,
    totalPages: query.data?.meta?.totalPages ?? 1,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    isEmpty: !query.isPending && (query.data?.campaigns?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};

// Hook lấy chi tiết 1 chiến dịch (dùng cho trang sửa)
export const useCampaignById = (id?: string) => {
  const query = useQuery({
    queryKey: id ? campaignKeys.detail(id) : campaignKeys.details(),
    queryFn: () => {
      if (!id) throw new Error("Campaign id is required");
      return campaignService.getCampaignById(id);
    },
    enabled: !!id,
    staleTime: 30_000,
  });

  return {
    campaign: query.data ?? null,
    loading: query.isPending,
    error: query.error ?? null,
    refetch: query.refetch,
  };
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (data: CreateCampaignDto) => campaignService.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });

  return { createCampaign: mutate, createCampaignAsync: mutateAsync, isPending, error: error as Error | null };
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignDto }) =>
      campaignService.updateCampaign(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
    },
  });

  return { updateCampaign: mutate, updateCampaignAsync: mutateAsync, isPending, error: error as Error | null };
};

// Đổi trạng thái nhanh — optimistic update ngay trong cache list để nút bấm phản hồi tức thời
export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      campaignService.updateCampaignStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: campaignKeys.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: campaignKeys.lists() });

      queryClient.setQueriesData({ queryKey: campaignKeys.lists() }, (old: any) => {
        if (!old?.campaigns) return old;
        return {
          ...old,
          campaigns: old.campaigns.map((c: SaleCampaign) =>
            c.id === id ? { ...c, status } : c,
          ),
        };
      });

      return { previousLists };
    },

    onError: (_err, _vars, context) => {
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: campaignKeys.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: campaignKeys.lists() });

      queryClient.setQueriesData({ queryKey: campaignKeys.lists() }, (old: any) => {
        if (!old?.campaigns) return old;
        return {
          ...old,
          campaigns: old.campaigns.filter((c: SaleCampaign) => c.id !== id),
          meta: old.meta ? { ...old.meta, total: (old.meta.total ?? 1) - 1 } : old.meta,
        };
      });

      return { previousLists };
    },

    onError: (_err, _id, context) => {
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });

  return { deleteCampaign: mutate, deleteCampaignAsync: mutateAsync, isPending };
};
