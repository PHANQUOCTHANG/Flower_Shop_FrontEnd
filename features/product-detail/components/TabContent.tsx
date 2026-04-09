/* eslint-disable @typescript-eslint/no-explicit-any */
import { DescriptionTab } from "./DescriptionTab";
import { ReviewsTab } from "./ReviewsTab";

type TabType = "description" | "reviews";

interface TabContentProps {
  activeTab: TabType;
  product: any;
  reviews: any;
}

// Hiển thị nội dung tab (Mô tả hoặc Đánh giá)
export function TabContent({ activeTab, product, reviews }: TabContentProps) {
  return (
    <div className="min-h-[200px]">
      {activeTab === "description" ? (
        <DescriptionTab product={product} />
      ) : (
        <ReviewsTab reviews={reviews} />
      )}
    </div>
  );
}
