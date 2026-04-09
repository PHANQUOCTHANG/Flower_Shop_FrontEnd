import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CART_CONFIG, CART_COLORS } from "../constants/cartConfig";

interface CartHeaderProps {
  itemCount: number;
}

// Header hiển thị số lượng sản phẩm & nút tiếp tục mua
export function CartHeader({ itemCount }: CartHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
      {/* Tiêu đề với số lượng */}
      <h1 className="typo-heading-lg">
        Giỏ hàng{" "}
        <span style={{ color: CART_COLORS.ACCENT }}>({itemCount})</span>
      </h1>

      {/* Nút quay lại mua sắm */}
      <button
        onClick={() => router.push(CART_CONFIG.PRODUCTS_ROUTE)}
        className="transition-all self-start sm:self-center group"
        style={{ color: CART_COLORS.ACCENT }}
      >
        <div className="typo-button-sm flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Tiếp tục mua sắm
        </div>
      </button>
    </div>
  );
}
