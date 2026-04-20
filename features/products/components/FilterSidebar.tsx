import { Filter, CheckCircle } from "lucide-react";
import { FilterSection } from "./FilterSection";
import { PRICE_RANGES } from "../constants/priceRanges";

interface FilterSidebarProps {
  minPrice: number | null;
  maxPrice: number | null;
  selectedCategory: string;
  categories: Array<{ id: string; name: string; slug: string }>;
  onPriceChange: (min: number | null, max: number | null) => void;
  onCategoryChange: (slug: string, isChecked: boolean) => void;
}

const MAX_VISIBLE_CATEGORIES = 10;

// Sidebar hiển thị bộ lọc theo giá và danh mục
export function FilterSidebar({
  minPrice,
  maxPrice,
  selectedCategory,
  categories,
  onPriceChange,
  onCategoryChange,
}: FilterSidebarProps) {
  return (
    <aside className="w-full md:w-72 lg:w-72 shrink-0 hidden md:block">
      <div className="sticky top-28 space-y-2">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={20} className="text-[#13ec5b]" />
            <h3 className="typo-heading-md text-[#0d1b12]">Bộ lọc</h3>
          </div>
          <p className="typo-caption-xs text-[#4c9a66]">Tinh chỉnh lựa chọn</p>
        </div>

        {/* Lọc theo giá */}
        <FilterSection title="Khoảng giá">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-3 cursor-pointer group/item"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={minPrice === range.min && maxPrice === range.max}
                  onChange={(e) =>
                    onPriceChange(
                      e.target.checked ? range.min : null,
                      e.target.checked ? range.max : null,
                    )
                  }
                  className="peer appearance-none size-5 border-2 border-[#ccc] rounded-md checked:bg-[#13ec5b] checked:border-[#13ec5b] transition-all"
                />
                <CheckCircle
                  size={12}
                  className="absolute left-1 text-[#0d1b12] opacity-0 peer-checked:opacity-100 transition-opacity"
                />
              </div>
              <span className="typo-body-sm text-[#4c9a66] group-hover/item:text-[#13ec5b] transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </FilterSection>

        {/* Lọc theo danh mục */}
        <FilterSection title="Danh mục">
          <div
            className={
              categories.length > 5
                ? "max-h-80 overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#ccc] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#13ec5b]"
                : "space-y-3"
            }
          >
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer group/item"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategory === category.slug}
                    onChange={(e) =>
                      onCategoryChange(category.slug, e.target.checked)
                    }
                    className="peer appearance-none size-5 border-2 border-[#ccc] rounded-md checked:bg-[#13ec5b] checked:border-[#13ec5b] transition-all"
                  />
                  <CheckCircle
                    size={12}
                    className="absolute left-1 text-[#0d1b12] opacity-0 peer-checked:opacity-100 transition-opacity"
                  />
                </div>
                <span className="typo-body-sm text-[#4c9a66] group-hover/item:text-[#13ec5b] transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}
