import React from "react";
import { Info, Sparkles } from "lucide-react";
import { Product } from "../types";

interface DescriptionTabProps {
  product: Product;
}

export const DescriptionTab: React.FC<DescriptionTabProps> = ({ product }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Bên trái */}
      <div className="space-y-6">
        {/* Về mẫu hoa */}
        <div className="space-y-2">
          <h4 className="typo-heading-sm flex items-center gap-2">
            <Info className="w-5 h-5 text-[#13ec5b]" />
            Về mẫu hoa này
          </h4>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Pure Elegance là bản giao hưởng nhẹ nhàng của những đóa Ly trắng
            tinh khôi kết hợp cùng nét bay bổng của hoa Baby nhập khẩu. Mỗi cành
            hoa đều được tuyển chọn kỹ lưỡng từ các trang trại tại Đà Lạt, đảm
            bảo độ tươi mới và hương thơm dịu nhẹ quyến rũ.
          </p>
        </div>

        {/* Thông điệp */}
        <div className="space-y-2">
          <h4 className="typo-heading-sm flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#13ec5b]" />
            Thông điệp truyền tải
          </h4>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.meaning}
          </p>
        </div>
      </div>

      {/* Bên phải - Lưu ý bảo quản */}
      <div className="bg-[#13ec5b]/5 rounded-2xl p-6 border border-[#13ec5b]/10 h-fit">
        <h4 className="typo-heading-md mb-4">Lưu ý bảo quản:</h4>
        <ul className="space-y-3 typo-body-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2">
            <span className="text-[#13ec5b]">•</span>
            Để hoa nơi thoáng mát, tránh ánh nắng trực tiếp hoặc gió điều hòa
            mạnh.
          </li>
          <li className="flex gap-2">
            <span className="text-[#13ec5b]">•</span>
            Thay nước sạch cho hoa mỗi 1-2 ngày một lần.
          </li>
          <li className="flex gap-2">
            <span className="text-[#13ec5b]">•</span>
            Cắt bớt gốc hoa theo chiều chéo khi thay nước để hoa hút nước tốt
            hơn.
          </li>
        </ul>
      </div>
    </div>
  );
};
