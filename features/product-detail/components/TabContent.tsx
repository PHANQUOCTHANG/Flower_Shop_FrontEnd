import { DescriptionTab } from "./DescriptionTab";
import { ReviewsTab } from "./ReviewsTab";
import { Product } from "@/features/product-detail/types";

type TabType = "description" | "reviews";

interface TabContentProps {
  activeTab: TabType;
  product: Product;
  slug: string;
}

// Hiển thị nội dung tab (Mô tả hoặc Đánh giá)
export function TabContent({ activeTab, product, slug }: TabContentProps) {
  return (
    <div className="min-h-[200px]">
      {activeTab === "description" ? (
        <DescriptionTab product={product} />
      ) : (
        <ReviewsTab slug={slug} />
      )}
    </div>
  );
}
