"use client";

import React, { useState } from "react";
import { Trash2, ShoppingBag, HeartOff } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

// --- Định nghĩa kiểu dữ liệu (Interfaces) ---
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
}

// --- Dữ liệu giả lập ban đầu ---
const INITIAL_WISHLIST: Product[] = [
  {
    id: "W-001",
    name: "Bó Hoa Hồng Red Naomi",
    price: 950000,
    originalPrice: 1100000,
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=600&q=80",
    category: "Bó hoa",
  },
  {
    id: "W-002",
    name: "Hoa Hướng Dương Nắng Mai",
    price: 550000,
    image:
      "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=600&q=80",
    category: "Quà tặng",
  },
  {
    id: "W-003",
    name: "Lẵng Hoa Cát Tường Quý Phái",
    price: 1200000,
    image:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80",
    category: "Lẵng hoa",
  },
  {
    id: "W-004",
    name: "Bó Hoa Tulip Trắng Tinh Khôi",
    price: 850000,
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    category: "Bó hoa",
  },
];

// --- Component con: Thẻ sản phẩm yêu thích ---
const ProductCard = ({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: (id: string) => void;
}) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-[#1a0c10] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-white/5">
      {/* Ảnh sản phẩm và nút xóa */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <button
          onClick={() => onRemove(product.id)}
          className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full text-slate-400 hover:text-[#ee2b5b] shadow-sm transition-colors active:scale-90"
          title="Xóa khỏi danh sách"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Thông tin chi tiết sản phẩm */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] font-black uppercase text-[#ee2b5b] tracking-widest mb-1">
          {product.category}
        </span>
        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2 leading-snug group-hover:text-[#ee2b5b] transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-[#ee2b5b] text-xl font-black">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          {product.originalPrice && (
            <span className="text-slate-400 text-xs line-through font-medium">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* Nút hành động (Đã bỏ phần So sánh giá) */}
        <div className="mt-auto">
          <button className="w-full bg-[#ee2b5b] text-white py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:bg-[#ee2b5b]/90 transition-all shadow-lg shadow-[#ee2b5b]/20 active:scale-95 uppercase tracking-wider">
            <ShoppingBag size={18} />
            THÊM VÀO GIỎ
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Component chính: WishlistPage ---
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>(INITIAL_WISHLIST);

  // Xử lý xóa sản phẩm khỏi danh sách
  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f6] dark:bg-[#10080a] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 px-6 lg:px-40 py-10 max-w-[1920px] mx-auto w-full">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Sản phẩm yêu thích" },
          ]}
        />

        {/* Tiêu đề trang */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-3 leading-tight">
            Sản phẩm <span className="text-[#ee2b5b]">yêu thích</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Lưu lại những bó hoa tuyệt đẹp để hoàn tất việc mua sắm sau này.
          </p>
        </div>

        {wishlist.length > 0 ? (
          /* Lưới hiển thị danh sách sản phẩm */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {wishlist.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onRemove={removeFromWishlist}
              />
            ))}
          </div>
        ) : (
          /* Trạng thái danh sách trống */
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in zoom-in-95 duration-700">
            <div className="size-48 mb-8 bg-[#ee2b5b]/5 rounded-full flex items-center justify-center text-[#ee2b5b]/30">
              <HeartOff size={84} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-3">
              Danh sách đang trống
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm font-medium">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy chọn cho
              mình những bó hoa ưng ý nhất nhé.
            </p>
            <button className="bg-[#ee2b5b] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#ee2b5b]/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm">
              Khám phá cửa hàng
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
