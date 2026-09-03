import React from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Tag } from "lucide-react";
import { SaleCampaign } from "@/types/campaign";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { ALLOWED_STATUS_TRANSITIONS, CAMPAIGN_STATUS_LABELS, CAMPAIGN_TYPE_LABELS } from "../types";
import { formatDate } from "@/utils/format";

interface CampaignTableProps {
  campaigns: SaleCampaign[];
  onDelete: (campaign: SaleCampaign) => void;
  onStatusChange: (campaign: SaleCampaign, status: string) => void;
  isLoading?: boolean;
}

export const CampaignTable = ({
  campaigns,
  onDelete,
  onStatusChange,
  isLoading = false,
}: CampaignTableProps) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="size-10 border-[3px] border-slate-200 border-t-[#13ec5b] rounded-full animate-spin" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Tên chiến dịch
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Loại
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Thời gian
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                Sản phẩm
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-slate-400 text-sm font-medium">
                  Chưa có chiến dịch nào
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => {
                const nextStatuses = ALLOWED_STATUS_TRANSITIONS[campaign.status] ?? [];
                return (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-[#13ec5b]/10 flex items-center justify-center shrink-0">
                          <Tag size={16} className="text-[#13ec5b]" />
                        </div>
                        <span className="font-bold text-sm text-slate-900">{campaign.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold">
                        {CAMPAIGN_TYPE_LABELS[campaign.type] ?? campaign.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <CampaignStatusBadge status={campaign.status} />
                        {nextStatuses.length > 0 && (
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) onStatusChange(campaign, e.target.value);
                            }}
                            className="text-[11px] border border-slate-200 rounded-lg px-1.5 py-1 text-slate-500 bg-white focus:outline-none focus:ring-1 focus:ring-[#13ec5b]/40"
                            title="Đổi trạng thái"
                          >
                            <option value="">Đổi →</option>
                            {nextStatuses.map((s) => (
                              <option key={s} value={s}>
                                {CAMPAIGN_STATUS_LABELS[s] ?? s}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                      {campaign.items?.length ?? 0}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                          className="p-2.5 text-slate-400 hover:text-[#13ec5b] transition-colors hover:bg-[#13ec5b]/10 rounded-xl"
                          title="Chỉnh sửa"
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          onClick={() => onDelete(campaign)}
                          className="p-2.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                          title="Xóa"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
