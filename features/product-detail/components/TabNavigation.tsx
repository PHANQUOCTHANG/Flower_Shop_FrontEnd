// Tab navigation để chuyển đổi giữa Mô tả & Đánh giá
type TabType = "description" | "reviews";

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  reviewsCount: number;
}

const COLOR_TOKENS = {
  PRIMARY: "#13ec5b",
} as const;

export function TabNavigation({
  activeTab,
  setActiveTab,
  reviewsCount,
}: TabNavigationProps) {
  // Kiểm tra tab có đang hoạt động không
  const isActive = (tab: TabType) => activeTab === tab;

  // Lấy class style của tab dựa trên trạng thái active
  const getTabStyle = (tab: TabType) =>
    `pb-4 typo-heading-sm transition-all relative ${
      isActive(tab) ? "border-b-2" : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div className="flex gap-8 border-b border-gray-100 mb-8">
      {/* Tab: Mô tả chi tiết */}
      <button
        onClick={() => setActiveTab("description")}
        className={getTabStyle("description")}
        style={{
          color: isActive("description") ? COLOR_TOKENS.PRIMARY : undefined,
        }}
      >
        Mô tả chi tiết
        {/* Highlight bar dưới tab khi active */}
        {isActive("description") && (
          <span
            className="absolute bottom-0 left-0 w-full h-1 rounded-full"
            style={{ backgroundColor: COLOR_TOKENS.PRIMARY }}
          />
        )}
      </button>

      {/* Tab: Đánh giá */}
      <button
        onClick={() => setActiveTab("reviews")}
        className={getTabStyle("reviews")}
        style={{
          color: isActive("reviews") ? COLOR_TOKENS.PRIMARY : undefined,
        }}
      >
        Đánh giá ({reviewsCount}){/* Highlight bar dưới tab khi active */}
        {isActive("reviews") && (
          <span
            className="absolute bottom-0 left-0 w-full h-1 rounded-full"
            style={{ backgroundColor: COLOR_TOKENS.PRIMARY }}
          />
        )}
      </button>
    </div>
  );
}
