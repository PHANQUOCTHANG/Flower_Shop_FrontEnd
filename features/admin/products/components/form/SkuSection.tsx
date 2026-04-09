"use client";
import { forwardRef } from "react";

interface SkuSectionProps {
  sku: string;
  onSkuChange: (value: string) => void;
}

const SkuSection = forwardRef<HTMLDivElement, SkuSectionProps>(
  ({ sku, onSkuChange }, ref) => {
    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold mb-6">🏷️ Mã SKU</h3>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            SKU
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="FLW-LAV-001"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] outline-none transition-colors"
          />
          <p className="text-xs text-slate-500 mt-1">
            Mã định danh duy nhất cho sản phẩm
          </p>
        </div>
      </section>
    );
  },
);

SkuSection.displayName = "SkuSection";

export default SkuSection;
