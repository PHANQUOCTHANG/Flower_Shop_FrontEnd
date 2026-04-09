// Header component cho product detail page
import Link from "next/link";
import {
  PRODUCT_CONFIG,
  PRODUCT_BREADCRUMBS,
} from "../../constants/productConfig";

interface ProductDetailHeaderProps {
  isEdit?: boolean;
}

// Header với breadcrumb & title
export function ProductDetailHeader({
  isEdit = true,
}: ProductDetailHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Link href={PRODUCT_CONFIG.PRODUCTS_LIST_ROUTE}>
          <button
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            title={PRODUCT_BREADCRUMBS.BACK}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </Link>
        <div>
          <nav className="flex text-xs text-slate-500 gap-2 mb-1">
            <span>{PRODUCT_BREADCRUMBS.PRODUCTS}</span>
            <span>{PRODUCT_BREADCRUMBS.SLASH}</span>
            <span className="text-[#ee2b5b] font-medium">
              {isEdit ? PRODUCT_BREADCRUMBS.DETAIL : PRODUCT_BREADCRUMBS.ADD}
            </span>
          </nav>
          <h2 className="text-xl font-bold">
            {isEdit ? "Chi tiết sản phẩm" : "Tạo sản phẩm mới"}
          </h2>
        </div>
      </div>
    </header>
  );
}
