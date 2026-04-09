"use client";
import { forwardRef } from "react";

interface PricingSectionProps {
  price: string;
  comparePrice: string;
  onPriceChange: (value: string) => void;
  onComparePriceChange: (value: string) => void;
}

const PricingSection = forwardRef<HTMLDivElement, PricingSectionProps>(
  ({ price, comparePrice, onPriceChange, onComparePriceChange }, ref) => {
    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold mb-6">💰 Giá bán</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Giá bán *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              step="1000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Giá so sánh (khuyến mãi)
            </label>
            <input
              type="number"
              value={comparePrice}
              onChange={(e) => onComparePriceChange(e.target.value)}
              step="1000"
              placeholder="Để trống nếu không khuyến mãi"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] outline-none transition-colors"
            />
          </div>
        </div>
      </section>
    );
  },
);

PricingSection.displayName = "PricingSection";

export default PricingSection;
