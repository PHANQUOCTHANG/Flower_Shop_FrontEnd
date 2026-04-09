"use client";
import { forwardRef } from "react";

interface StatusSectionProps {
  status: "active" | "hidden" | "draft";
  onStatusChange: (value: "active" | "hidden" | "draft") => void;
}

const StatusSection = forwardRef<HTMLDivElement, StatusSectionProps>(
  ({ status, onStatusChange }, ref) => {
    const statuses = [
      {
        value: "active",
        label: "Hoạt động",
        icon: "✓",
        color: "text-green-600",
      },
      { value: "hidden", label: "Ẩn", icon: "ⓘ", color: "text-slate-600" },
      { value: "draft", label: "Nháp", icon: "✎", color: "text-amber-600" },
    ] as const;

    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold mb-6">📊 Trạng thái</h3>
        <div className="space-y-3">
          {statuses.map((s) => (
            <label
              key={s.value}
              className="flex items-center cursor-pointer hover:bg-slate-50 p-3 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="status"
                value={s.value}
                checked={status === s.value}
                onChange={(e) =>
                  onStatusChange(
                    e.target.value as "active" | "hidden" | "draft",
                  )
                }
                className="w-4 h-4 accent-[#ee2b5b] cursor-pointer"
              />
              <span className={`ml-3 font-medium ${s.color}`}>{s.icon}</span>
              <span className="ml-2 text-sm font-medium text-slate-700">
                {s.label}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Chỉ sản phẩm trạng thái &quot;Hoạt động&quot; mới hiển thị cho khách
          hàng
        </p>
      </section>
    );
  },
);

StatusSection.displayName = "StatusSection";

export default StatusSection;
