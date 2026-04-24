// Tab navigation để chuyển đổi giữa Mô tả & Đánh giá
import { useProductReviews } from "@/features/product-detail/hooks/useProductReviews";

type TabType = "description" | "reviews";

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  slug: string;
}

const PRIMARY = "#13ec5b";

export function TabNavigation({ activeTab, setActiveTab, slug }: TabNavigationProps) {
  // Lấy tổng số đánh giá (limit=1 để nhẹ, chỉ cần meta.total)
  const { data } = useProductReviews({ slug, page: 1, limit: 1 });
  const total = data?.total ?? 0;

  const isActive = (tab: TabType) => activeTab === tab;

  const tabStyle = (tab: TabType) =>
    `pb-4 typo-heading-sm transition-all relative ${
      isActive(tab) ? "border-b-2" : "text-gray-400 hover:text-gray-600"
    }`;

  const ActiveBar = () => (
    <span
      className="absolute bottom-0 left-0 w-full h-1 rounded-full"
      style={{ backgroundColor: PRIMARY }}
    />
  );

  return (
    <div className="flex gap-8 border-b border-gray-100 mb-8">
      {/* Tab: Mô tả chi tiết */}
      <button
        onClick={() => setActiveTab("description")}
        className={tabStyle("description")}
        style={{ color: isActive("description") ? PRIMARY : undefined }}
      >
        Mô tả chi tiết
        {isActive("description") && <ActiveBar />}
      </button>

      {/* Tab: Đánh giá */}
      <button
        onClick={() => setActiveTab("reviews")}
        className={tabStyle("reviews")}
        style={{ color: isActive("reviews") ? PRIMARY : undefined }}
      >
        Đánh giá {total > 0 && `(${total})`}
        {isActive("reviews") && <ActiveBar />}
      </button>
    </div>
  );
}
