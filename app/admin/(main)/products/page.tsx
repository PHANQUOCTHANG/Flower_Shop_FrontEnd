"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Bell,
  ShoppingBag,
} from "lucide-react";
import { Loading } from "@/components/ui/Loading";
import { DeleteConfirmDialog } from "@/components/ui/admin/DeleteConfirmDialog";
import { Pagination } from "@/components/ui/admin/Pagination";
import { ChevronDown, Filter, X } from "lucide-react";

// Dữ liệu sản phẩm - phù hợp với Prisma model
const PRODUCTS = [
  {
    id: 1n,
    name: "Bó hoa hồng đỏ Premium",
    slug: "bo-hoa-hong-do-premium",
    sku: "FLW-001",
    price: 550000,
    comparePrice: 599000,
    costPrice: 250000,
    stockQuantity: 12,
    lowStockThreshold: 5,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=400&q=80",
    status: "active",
    categories: [{ name: "Sinh nhật" }],
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: 2n,
    name: "Lẵng hoa Khai trương Hồng Phát",
    slug: "lang-hoa-khai-truong-hong-phat",
    sku: "FLW-042",
    price: 1200000,
    comparePrice: 1400000,
    costPrice: 600000,
    stockQuantity: 5,
    lowStockThreshold: 3,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80",
    status: "active",
    categories: [{ name: "Khai trương" }],
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
  },
  {
    id: 3n,
    name: "Bó hoa cúc trắng chia buồn",
    slug: "bo-hoa-cuc-trang-chia-buon",
    sku: "FLW-009",
    price: 300000,
    comparePrice: 350000,
    costPrice: 150000,
    stockQuantity: 0,
    lowStockThreshold: 5,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1563240381-5ccf7690ca08?w=400&q=80",
    status: "active",
    categories: [{ name: "Tang lễ" }],
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
  },
  {
    id: 4n,
    name: "Bó hoa hướng dương rạng rỡ",
    slug: "bo-hoa-huong-duong-rang-ro",
    sku: "FLW-015",
    price: 450000,
    comparePrice: 500000,
    costPrice: 220000,
    stockQuantity: 18,
    lowStockThreshold: 5,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=400&q=80",
    status: "active",
    categories: [{ name: "Kỷ niệm" }],
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
];

// Thẻ thống kê mini
const StatCardMini = ({
  label,
  value,
  colorClass,
  icon: Icon,
}: {
  label: string;
  value: string;
  colorClass: string;
  icon: any;
}) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:scale-[1.02] transition-transform">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p
          className={`text-2xl font-black mt-1 ${colorClass || "text-slate-900 dark:text-white"}`}
        >
          {value}
        </p>
      </div>
      <div
        className={`p-2 rounded-lg ${colorClass ? "bg-current opacity-10" : "bg-slate-100 dark:bg-zinc-800"}`}
      >
        {Icon && <Icon size={20} className={colorClass || "text-slate-400"} />}
      </div>
    </div>
  </div>
);

// Component chính
export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pending filters (chưa được áp dụng)
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

  // Applied filters (đã được áp dụng - dùng để filter sản phẩm)
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("Tất cả");
  const [appliedSortBy, setAppliedSortBy] = useState("newest");
  const [appliedPriceRange, setAppliedPriceRange] = useState("all");

  // Pagination & UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] = useState<
    (typeof PRODUCTS)[0] | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Khởi tạo state từ URL query params
  useEffect(() => {
    const keyword = searchParams.get("search") || "";
    const category = searchParams.get("category") || "Tất cả";
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "newest";
    const priceRng = searchParams.get("priceRange") || "all";

    // Cập nhật cả pending và applied filters từ URL
    setSearchKeyword(keyword);
    setSelectedCategory(category);
    setCurrentPage(page);
    setSortBy(sort);
    setPriceRange(priceRng);

    // Applied filters cũng được set từ URL (vì URL là state của applied)
    setAppliedSearchKeyword(keyword);
    setAppliedCategory(category);
    setAppliedSortBy(sort);
    setAppliedPriceRange(priceRng);

    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Hàm cập nhật URL với query params
  const updateQueryParams = (
    keyword?: string,
    category?: string,
    page?: number,
    sort?: string,
    priceRng?: string,
  ) => {
    const params = new URLSearchParams();

    if (keyword !== undefined) {
      if (keyword) params.set("search", keyword);
      setSearchKeyword(keyword);
    } else if (searchKeyword) {
      params.set("search", searchKeyword);
    }

    if (category !== undefined) {
      if (category !== "Tất cả") params.set("category", category);
      setSelectedCategory(category);
    } else if (selectedCategory !== "Tất cả") {
      params.set("category", selectedCategory);
    }

    const pageNum = page !== undefined ? page : currentPage;
    if (pageNum > 1) params.set("page", pageNum.toString());
    if (page !== undefined) setCurrentPage(pageNum);

    const sortValue = sort !== undefined ? sort : sortBy;
    if (sortValue !== "newest") params.set("sort", sortValue);
    if (sort !== undefined) setSortBy(sortValue);

    const priceRngValue = priceRng !== undefined ? priceRng : priceRange;
    if (priceRngValue !== "all") params.set("priceRange", priceRngValue);
    if (priceRng !== undefined) setPriceRange(priceRngValue);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/products");
  };

  // Xử lý thay đổi tìm kiếm (không cập nhật URL ngay, chỉ cập nhật state)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
  };

  // Xử lý thay đổi danh mục (không cập nhật URL ngay, chỉ cập nhật state)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  // Xử lý thay đổi sắp xếp (không cập nhật URL ngay, chỉ cập nhật state)
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    setSortBy(sort);
  };

  // Xử lý thay đổi khung giá (không cập nhật URL ngay, chỉ cập nhật state)
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const range = e.target.value;
    setPriceRange(range);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsLoading(true);
    updateQueryParams(
      appliedSearchKeyword,
      appliedCategory,
      newPage,
      appliedSortBy,
      appliedPriceRange,
    );
  };

  // Xử lý áp dụng lọc (copy pending filters → applied filters + update URL)
  const handleApplyFilter = () => {
    // Copy pending filters to applied filters
    setAppliedSearchKeyword(searchKeyword);
    setAppliedCategory(selectedCategory);
    setAppliedSortBy(sortBy);
    setAppliedPriceRange(priceRange);

    // Reset page to 1
    setCurrentPage(1);
    setIsLoading(true);

    // Update URL with applied filters
    updateQueryParams(searchKeyword, selectedCategory, 1, sortBy, priceRange);
  };

  // Xử lý xóa lọc
  const handleClearFilter = () => {
    // Reset pending filters
    setSearchKeyword("");
    setSelectedCategory("Tất cả");
    setSortBy("newest");
    setPriceRange("all");

    // Reset applied filters
    setAppliedSearchKeyword("");
    setAppliedCategory("Tất cả");
    setAppliedSortBy("newest");
    setAppliedPriceRange("all");

    setCurrentPage(1);
    setIsLoading(true);
    router.push("/admin/products");
  };

  // Xử lý mở dialog xác nhận xóa
  const handleOpenDeleteDialog = (product: (typeof PRODUCTS)[0]) => {
    setSelectedProductForDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Xử lý đóng dialog xác nhận xóa
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductForDelete(null);
  };

  // Xử lý xác nhận xóa sản phẩm
  const handleConfirmDelete = async () => {
    if (!selectedProductForDelete) return;

    setIsDeleting(true);
    try {
      // Simulate delete API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // TODO: Gọi API xóa sản phẩm từ backend
      console.log("Xóa sản phẩm:", selectedProductForDelete.id);

      handleCloseDeleteDialog();
      // TODO: Refresh danh sách sản phẩm sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Hàm lấy giáMin và giáMax từ priceRange
  const getPriceMinMax = (range: string) => {
    switch (range) {
      case "under-500k":
        return { min: 0, max: 500000 };
      case "500k-1m":
        return { min: 500000, max: 1000000 };
      case "1m-2m":
        return { min: 1000000, max: 2000000 };
      case "above-2m":
        return { min: 2000000, max: Number.MAX_VALUE };
      default:
        return { min: 0, max: Number.MAX_VALUE };
    }
  };

  const { min: priceMinFilter, max: priceMaxFilter } =
    getPriceMinMax(appliedPriceRange);

  // Lọc sản phẩm theo filters đã áp dụng
  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(appliedSearchKeyword.toLowerCase()) &&
        (appliedCategory === "Tất cả" ||
          p.categories.some((c) => c.name === appliedCategory)) &&
        p.price >= priceMinFilter &&
        p.price <= priceMaxFilter,
    );

    // Áp dụng sắp xếp
    const sorted = [...filtered].sort((a, b) => {
      switch (appliedSortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return sorted;
  }, [
    appliedSearchKeyword,
    appliedCategory,
    priceMinFilter,
    priceMaxFilter,
    appliedSortBy,
  ]);

  const categories = [
    "Tất cả",
    "Sinh nhật",
    "Khai trương",
    "Tang lễ",
    "Kỷ niệm",
  ];

  // Các khung giá cố định
  const priceRanges = [
    { value: "all", label: "Tất cả giá" },
    { value: "under-500k", label: "Dưới 500.000₫" },
    { value: "500k-1m", label: "500.000₫ - 1.000.000₫" },
    { value: "1m-2m", label: "1.000.000₫ - 2.000.000₫" },
    { value: "above-2m", label: "Trên 2.000.000₫" },
  ];

  return (
    <>
      {isLoading && <Loading />}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm"
        itemName={selectedProductForDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={isDeleting}
      />
      <div className="flex flex-col h-full overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 py-5">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <h1 className="text-slate-900 dark:text-white text-2xl font-black uppercase tracking-tight">
              Quản lý sản phẩm
            </h1>
            <div className="flex items-center gap-4">
              {/* Nút thông báo */}
              <button className="relative p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </button>
              {/* Nút thêm sản phẩm */}
              <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-3 rounded-xl text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
                <PlusCircle size={20} />
                <span>Thêm sản phẩm</span>
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung */}
        <main className="p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
          {/* Thanh lọc & tìm kiếm */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            {/* Nhóm left: Tìm kiếm, danh mục, giá */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
              {/* Tìm kiếm */}
              <div className="relative w-full md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-2.5 border-none rounded-xl bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm"
                  placeholder="Tìm tên hoa, mã sản phẩm..."
                  type="text"
                />
              </div>

              {/* Bộ lọc danh mục */}
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Lọc khung giá */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
                  Giá:
                </label>
                <select
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm cursor-pointer"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nhóm right: Sắp xếp và nút lọc */}
            <div className="flex items-center gap-3">
              {/* Nút lọc */}
              <button
                onClick={handleApplyFilter}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13ec5b] text-[#102216] text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <Filter size={16} />
                <span>Lọc</span>
              </button>

              {/* Nút xóa lọc */}
              <button
                onClick={handleClearFilter}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-sm"
              >
                <X size={16} />
                <span>Xóa lọc</span>
              </button>
              <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
                Sắp xếp:
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm cursor-pointer appearance-none pr-10"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/30 border-b border-slate-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-center">
                      Ảnh
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[280px]">
                      Thông tin hoa
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Đơn giá
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Tồn kho
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      <td className="px-6 py-4 text-center">
                        <div className="size-14 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200 dark:border-zinc-700 mx-auto">
                          <img
                            className={`w-full h-full object-cover ${product.stockQuantity === 0 ? "grayscale opacity-50" : ""}`}
                            src={product.thumbnailUrl || ""}
                            alt={product.name}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span
                            className={`font-bold text-base ${product.stockQuantity === 0 ? "text-slate-400 dark:text-zinc-600" : "text-slate-900 dark:text-white"}`}
                          >
                            {product.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black uppercase text-slate-400">
                              SKU: {product.sku || "N/A"}
                            </span>
                            <span className="size-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-black uppercase text-[#13ec5b]">
                              {product.categories[0]?.name || "Không xác định"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-[#13ec5b]">
                        {product.price.toLocaleString("vi-VN")}₫
                      </td>
                      <td
                        className={`px-6 py-4 text-center text-sm font-black ${product.stockQuantity === 0 ? "text-red-500" : "text-slate-600 dark:text-zinc-400"}`}
                      >
                        {product.stockQuantity}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center gap-2 ${product.stockQuantity > 0 ? "text-[#13ec5b]" : "text-red-500"}`}
                        >
                          <div
                            className={`size-2 rounded-full ${product.stockQuantity > 0 ? "bg-[#13ec5b] animate-pulse" : "bg-red-500"}`}
                          ></div>
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {product.stockQuantity > 0
                              ? "Còn hàng"
                              : "Hết hàng"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 text-slate-400 hover:text-[#13ec5b] transition-colors hover:bg-[#13ec5b]/10 rounded-xl">
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteDialog(product)}
                            className="p-2.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <Pagination
              currentPage={currentPage}
              totalPages={3}
              totalItems={156}
              itemsPerPage={50}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Thẻ thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCardMini
              label="Tổng sản phẩm"
              value="156"
              icon={Package}
              colorClass="bg-[#13ec5b]/10 text-[#13ec5b]"
            />
            <StatCardMini
              label="Đang kinh doanh"
              value="142"
              colorClass="text-[#13ec5b]"
              icon={ShoppingBag}
            />
            <StatCardMini
              label="Hết hàng"
              value="8"
              colorClass="text-red-500"
              icon={Trash2}
            />
            <StatCardMini
              label="Ngừng bán"
              value="6"
              colorClass="text-slate-400"
              icon={Package}
            />
          </div>
        </main>
      </div>
    </>
  );
}
