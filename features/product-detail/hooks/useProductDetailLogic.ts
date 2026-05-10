import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
// Dùng hook chuyên biệt của feature product-detail (có sẵn addToCart, similarProducts)
import { useProductDetail } from "@/features/product-detail/hooks/useProductDetail";

export function useProductDetailLogic() {
  const params = useParams();
  const router = useRouter();
  // Lấy slug từ URL params
  const slug = params.slug as string;

  // --- Auth ---
  const isLogin = useAuthStore((state) => state.isAuthenticated);

  // --- Lấy dữ liệu sản phẩm & sản phẩm tương tự (Fetch Data) ---
  const {
    product,
    similarProducts,
    loading,
    error,
    addToCart,       // hàm addToCart do hook tự quản lý
    isAddingToCart,  // trạng thái đang thêm vào giỏ
  } = useProductDetail({ slug });

  // --- Trạng thái cục bộ (Local State) ---
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0); // Chỉ số ảnh hiện tại trong Gallery
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // --- Các hàm xử lý (Handlers) ---

  // Hiển thị thông báo nhanh
  const showAlert = useCallback((type: "success" | "error", message: string) => {
    setAlert({ type, message });
  }, []);

  // Thay đổi số lượng (tăng/giảm)
  const handleQuantityChange = useCallback((type: "inc" | "dec") => {
    setQuantity((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec" && prev > 1) return prev - 1;
      return prev;
    });
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = useCallback(
    async (qty: number) => {
      if (!isLogin) {
        showAlert("error", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        return;
      }
      try {
        await addToCart(qty);
        showAlert("success", "Thêm vào giỏ hàng thành công!");
        setQuantity(1);
      } catch {
        showAlert("error", "Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    },
    [isLogin, addToCart, showAlert],
  );

  return {
    state: {
      slug,
      product,
      similarProducts,
      loading,
      error,
      activeTab,
      quantity,
      activeImage,
      alert,
      isAdding: isAddingToCart,
    },
    actions: {
      setActiveTab,
      setQuantity,
      setActiveImage,
      setAlert,
      handleQuantityChange,
      handleAddToCart,
    },
  };
}
