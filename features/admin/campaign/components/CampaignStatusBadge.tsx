import { CAMPAIGN_STATUS_LABELS } from "../types";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SCHEDULED: "bg-orange-50 text-orange-600",
  ACTIVE: "bg-green-50 text-green-600",
  ENDED: "bg-slate-100 text-slate-500",
};

export function CampaignStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {CAMPAIGN_STATUS_LABELS[status] ?? status}
    </span>
  );
}
