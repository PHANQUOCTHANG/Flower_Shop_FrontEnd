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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      {/* Tiêu đề với số lượng */}
      <h1 className="text-xl font-bold text-gray-900">
        Giỏ hàng của bạn ({itemCount} sản phẩm)
      </h1>

      {/* Nút quay lại mua sắm */}
      <button
        onClick={() => router.push(CART_CONFIG.PRODUCTS_ROUTE)}
        className="transition-all self-start sm:self-center text-[#e91e63] hover:opacity-80"
      >
        <div className="text-sm font-bold flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Mua thêm sản phẩm khác
        </div>
      </button>
    </div>
  );
}
