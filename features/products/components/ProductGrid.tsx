import { ProductCard } from "./ProductCard";

type ViewMode = "grid" | "list";

interface ProductGridProps {
  products: Array<{ id: string; [key: string]: unknown }>;
  viewMode: ViewMode;
  fetching: boolean;
}

// Hiển thị danh sách sản phẩm ở chế độ grid hoặc list
export function ProductGrid({
  products,
  viewMode,
  fetching,
}: ProductGridProps) {
  return (
    <div
      className={`transition-opacity duration-200 ${fetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}
    >
      {products.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
              : "flex flex-col gap-4 max-h-[1150px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#13ec5b]"
          }
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="typo-body text-[#4c9a66]">
            Không tìm thấy sản phẩm nào
          </p>
        </div>
      )}
    </div>
  );
}
