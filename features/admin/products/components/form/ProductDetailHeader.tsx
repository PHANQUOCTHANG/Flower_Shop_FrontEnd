// Header component cho product detail page
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  PRODUCT_CONFIG,
  PRODUCT_BREADCRUMBS,
  PRODUCT_FORM_LABELS,
} from "../../constants/productConfig";

interface ProductDetailHeaderProps {
  isEdit?: boolean;
}

// Header với breadcrumb & title
export function ProductDetailHeader({
  isEdit = true,
}: ProductDetailHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 md:px-8 py-3 sm:py-4 sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-4 max-w-[1400px] mx-auto">
        <Link href={PRODUCT_CONFIG.PRODUCTS_LIST_ROUTE}>
          <button
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0"
            title={PRODUCT_FORM_LABELS.BACK}
          >
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div className="min-w-0">
          <nav className="flex items-center text-[10px] sm:text-xs font-bold text-slate-400 gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 uppercase tracking-wider">
            <span>{PRODUCT_BREADCRUMBS.PRODUCTS}</span>
            <span>{PRODUCT_BREADCRUMBS.SLASH}</span>
            <span className="text-[#13ec5b]">
              {isEdit ? PRODUCT_BREADCRUMBS.DETAIL : PRODUCT_BREADCRUMBS.ADD}
            </span>
          </nav>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate ">
            {isEdit ? "Chi tiết sản phẩm" : "Tạo sản phẩm mới"}
          </h2>
        </div>
      </div>
    </header>
  );
}
