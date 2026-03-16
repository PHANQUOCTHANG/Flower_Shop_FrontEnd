"use client";

import { useState } from "react";

export default function AddNewProductPage() {
  const [status, setStatus] = useState<"active" | "hidden" | "draft">("active");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9"
  );
  const [categories, setCategories] = useState([
    "Bó hoa", "Hoa cưới", "Cây nội thất", "Hoa chia buồn", "Hoa theo mùa",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Bó hoa"]);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
    if (!selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
    }
    setSelectedCategory(trimmed);
    setNewCatName("");
    setShowNewCatInput(false);
  };

  const handleSelectCategory = (val: string) => {
    setSelectedCategory(val);
    if (val && !selectedTags.includes(val)) {
      setSelectedTags((prev) => [...prev, val]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="flex min-h-screen bg-[#f8f6f6] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ee2b5b] rounded-xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.8 3.7C7.2 10.8 6 12.8 6 15h12c0-2.2-1.2-4.2-3.3-4.8 1.1-.9 1.8-2.2 1.8-3.7C16.5 4 14.5 2 12 2zm0 2c1.4 0 2.5 1.1 2.5 2.5S13.4 9 12 9 9.5 7.9 9.5 6.5 10.6 4 12 4z"/>
              <path d="M6 17v3h12v-3H6z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">BloomAdmin</h1>
            <p className="text-xs text-slate-500 mt-1">Quản lý hoa</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {[
            { icon: "⊞", label: "Tổng quan", active: false },
            { icon: "📦", label: "Sản phẩm", active: true },
            { icon: "🛒", label: "Đơn hàng", active: false },
            { icon: "👥", label: "Khách hàng", active: false },
            { icon: "📊", label: "Báo cáo", active: false },
          ].map(({ label, active }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#ee2b5b]/10 text-[#ee2b5b]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="w-5 h-5 inline-flex items-center justify-center text-base">
                {label === "Tổng quan" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {label === "Sản phẩm" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
                {label === "Đơn hàng" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {label === "Khách hàng" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {label === "Báo cáo" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
              </span>
              {label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cài đặt
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <nav className="flex text-xs text-slate-500 gap-2 mb-1">
                <span>Sản phẩm</span>
                <span>/</span>
                <span className="text-[#ee2b5b] font-medium">Thêm mới</span>
              </nav>
              <h2 className="text-xl font-bold">Tạo sản phẩm mới</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm hoa..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#ee2b5b] focus:outline-none w-64"
              />
            </div>
            <button className="p-2 text-slate-600 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ee2b5b] rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS87QJcHInaZh3Dx8utEOPwizy0VTIrdSk6cJC1CGMTotor4cVrHpcZ_jd0L6-sICyUCxaqL4jQ0fLlSwhq3bG25h4c9QlHK8i7COwVEsdY90ZsCWR1NwGh3hCVuObmV4Eu6aRqFw9XmFJUeZzmFJC9MARi4Vo_iIlknEuZDLdjInSEM1d7djNFEJaMJfz4UnMRj0fTnDdjijTA9GMO9ANl2mM87KdXZ6Nu6qq8vfSjz_IC25iW0isOe1HekNlH9MzqM0DIBpv4C4V"
                alt="Ảnh quản trị viên"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="px-8 py-8">
          <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left Column ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#ee2b5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Thông tin cơ bản
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tên sản phẩm</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="VD: Bó hoa oải hương nửa đêm"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Đường dẫn (Slug)</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm whitespace-nowrap">
                        bloom.shop/product/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        placeholder="bo-hoa-oai-huong-nua-dem"
                        className="flex-1 min-w-0 rounded-none rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mô tả ngắn</label>
                    <textarea
                      name="shortDescription"
                      placeholder="Tóm tắt ngắn gọn cho thẻ sản phẩm..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mô tả chi tiết</label>
                    <textarea
                      name="description"
                      placeholder="Câu chuyện sản phẩm, hướng dẫn chăm sóc và ghi chú về hoa..."
                      rows={6}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#ee2b5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Giá bán
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Giá bán", name: "price" },
                    { label: "Giá so sánh", name: "comparePrice" },
                    { label: "Giá gốc", name: "costPrice" },
                  ].map(({ label, name }) => (
                    <div key={name}>
                      <label className="block text-sm font-semibold mb-2">{label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₫</span>
                        <input
                          type="number"
                          name={name}
                          step="0.01"
                          className="pl-8 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                        />
                      </div>
                      {name === "costPrice" && (
                        <p className="text-[10px] text-slate-500 mt-1">Khách hàng sẽ không thấy giá này.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#ee2b5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Kho hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mã SKU</label>
                    <input
                      type="text"
                      name="sku"
                      placeholder="FLW-LAV-001"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Số lượng tồn kho</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      defaultValue={0}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ngưỡng tồn kho thấp</label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      defaultValue={5}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#ee2b5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Hình ảnh sản phẩm
                  </h3>
                  <button type="button" className="text-[#ee2b5b] text-sm font-bold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm ảnh
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Drop Zone */}
                  <div className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Thả file vào đây</span>
                  </div>
                  {/* Image Thumbnails */}
                  {[
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDMKVWR0Wmn9aIWAbPGh5_7mWbRBdzoeS--ykWlsJbrj4Z9hpJGnzluzcPIe_P9wNMzKtmzk1EhHvI0gYwFMy5uGfpyI7FTJsclLtCUOHEmocNvjteCBeg8dXo8l-TcM-W7OQYp1uoRYpBddJ3heeRLynPlI7KfbSeTGszXGP_x8-DdV1Q8YaIudtSOV_HiQHA_0H06L2GZKqrVXcLfNxjiTBbtBUX03FLJdOg6wr1fMsTNVXml0sODUnGRrjgd6NtSq2RXhPrdH_lZ",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCAU7dka41eMt1mP6JQvZLQSfJK7LJvZsG-Ee76B5OZbZWd5dJrmym9vGnYRMEC07GGuDVJeHAQdn_cbcGoy08Qe5Z-eBMqP3r66mDpNBJqCVq8tjtoiRHnGkbiJ2E1-BXVnLYXPKXhgdUtPSpFASGtxwrdqOOWjIXNWbsoRI8lpJ5EG2Ly-dcQ_MvDy7Je7ZauFfih0DlTikOaOFBWRlda6oKhgoOeyu0Oj0-HaQtYtegRrdfN3RvNjeTSV_cvGl9CSAYi9Z4FkWq3",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAD1qqW3CHe9HzusIayIJs8Qzbv1EPLR3pnupa0Oz79MPiXKs-ecaX4iSQ96CiTKWHEtHCnN1J8QmaurIlwJQmyrGTFrPrXL25LtdACyZBcr56S0lIbn9Bijk_5Z3a2nZ0DBOSSzDv-iakKL5RaxXgm5nMpQ9PYAMcq7u7mKI9vNiQTnZkKJF9CTHNPg9MWG8lMkLYChdgy45QVX1n91EHwtFP3JqndVa_83r3ppxXAZWIvngv_0i3U0lSaA8SjdUQY1nGjOmPbMYEV",
                  ].map((src, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden group relative">
                      <img src={src} alt={`Hình sản phẩm ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button type="button" className="p-1.5 bg-white rounded-full text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Column ── */}
            <div className="space-y-8">
              {/* Status */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Trạng thái sản phẩm</h3>
                <div className="space-y-3">
                  {(["active", "hidden", "draft"] as const).map((val) => (
                    <label
                      key={val}
                      onClick={() => setStatus(val)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        status === val
                          ? "bg-[#ee2b5b]/5 border-[#ee2b5b]"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={val}
                        checked={status === val}
                        onChange={() => setStatus(val)}
                        className="text-[#ee2b5b] focus:ring-[#ee2b5b]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {val === "active" && "Đang hoạt động"}
                          {val === "hidden" && "Ẩn"}
                          {val === "draft" && "Bản nháp"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {val === "active" && "Hiển thị trên cửa hàng."}
                          {val === "hidden" && "Không hiển thị với khách hàng."}
                          {val === "draft" && "Đang trong quá trình soạn thảo."}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Danh mục sản phẩm</h3>

                {/* Select + Add button */}
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleSelectCategory(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none bg-white"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCatInput((v) => !v)}
                    title="Tạo danh mục mới"
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      showNewCatInput
                        ? "bg-[#ee2b5b]/10 text-[#ee2b5b]"
                        : "bg-slate-100 text-slate-600 hover:bg-[#ee2b5b]/10 hover:text-[#ee2b5b]"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 transition-transform duration-200 ${showNewCatInput ? "rotate-45" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Inline new category input */}
                {showNewCatInput && (
                  <div className="mt-3 flex gap-2 items-center animate-in slide-in-from-top-1 duration-150">
                    <div className="relative flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                        placeholder="Tên danh mục mới..."
                        autoFocus
                        className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={!newCatName.trim()}
                      className="px-3 py-2 bg-[#ee2b5b] text-white text-xs font-bold rounded-lg hover:bg-[#d42552] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Tạo &amp; chọn
                    </button>
                  </div>
                )}

                {/* Selected tags */}
                {selectedTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[#ee2b5b]/10 text-[#ee2b5b] text-[10px] font-bold rounded-full flex items-center gap-1 border border-[#ee2b5b]/20"
                      >
                        {tag.toUpperCase()}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-[#d42552] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">URL ảnh đại diện</h3>
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-slate-100 flex items-center justify-center group relative">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY_iu3L8deWMSgXYaqyOuTVygTxkVQyv0Ys9BL12vJNYAfwWbPSdgqcH83GFCuwRK3vpTv6ulY41YVCjIDZXGluTNHn8_cVgN7Aa5Cq8Pshj2y-toZyp29r5XiLBprpwrqNPpUmOgYDh5kZRRAYSuXM_mAjmjyUW0fUvcLaGgKv0B-pu8NNhTkI4d1iiO6gGy0LpSWyxXNZl4ZIkhCf8DBbdHo2nmVubpI8VuvmgyK_vkNmY3QzWt02kXwbwoC0-2G2TymbEJVdR9T"
                    alt="Ảnh đại diện sản phẩm"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button type="button" className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                      Đổi ảnh
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                />
              </div>

              {/* SEO Optimization */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#ee2b5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Tối ưu SEO
                </h3>
                {/* Google Preview */}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Xem trước kết quả tìm kiếm</p>
                  <div className="max-w-md">
                    <div className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate mb-1">
                      Bó hoa Oải Hương Nửa Đêm - Hoa Cao Cấp | BloomShop
                    </div>
                    <div className="text-[#006621] text-sm truncate mb-1">
                      https://bloom.shop › product › bo-hoa-oai-huong-nua-dem
                    </div>
                    <div className="text-[#4d5156] text-sm line-clamp-2">
                      Bó hoa Oải Hương Nửa Đêm thủ công với cành hoa hữu cơ tươi và cây xanh theo mùa cao cấp. Thích hợp làm quà tặng và liệu pháp hương thơm...
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-semibold">Tiêu đề Meta</label>
                      <span className="text-[10px] text-slate-500 font-medium">54 / 60</span>
                    </div>
                    <input
                      type="text"
                      name="metaTitle"
                      placeholder="Tiêu đề trang cho công cụ tìm kiếm"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-semibold">Mô tả Meta</label>
                      <span className="text-[10px] text-slate-500 font-medium">132 / 160</span>
                    </div>
                    <textarea
                      name="metaDescription"
                      placeholder="Tóm tắt ngắn về trang..."
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Từ khóa Meta</label>
                    <input
                      type="text"
                      name="metaKeywords"
                      placeholder="oải hương, bó hoa, hoa tươi, giao hàng"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-2 italic">Phân cách các từ khóa bằng dấu phẩy.</p>
                  </div>
                </div>
              </div>

              {/* SEO Analysis */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center justify-between">
                  Phân tích SEO
                  <span className="text-[#ee2b5b] text-[10px] font-bold bg-[#ee2b5b]/10 px-2 py-0.5 rounded">THỜI GIAN THỰC</span>
                </h3>
                {/* Score */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="stroke-slate-100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3"
                      />
                      <path
                        stroke="#22c55e"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        strokeDasharray="85, 100"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">85</span>
                      <span className="text-[8px] font-bold text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold mt-2 text-green-500">Điểm SEO tốt</p>
                </div>

                {/* Keyword & Readability */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Mật độ từ khóa", value: "1,2%", ok: true },
                    { label: "Khả năng đọc", value: "Tốt", ok: true },
                  ].map(({ label, value, ok }) => (
                    <div key={label} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{value}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Focus Keyword */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Từ khóa trọng tâm</label>
                  <input
                    type="text"
                    defaultValue="Bó hoa oải hương"
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                  />
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                  {[
                    { icon: "check", color: "text-green-500", text: "Từ khóa trọng tâm có trong tiêu đề SEO" },
                    { icon: "check", color: "text-green-500", text: "Độ dài mô tả Meta đạt chuẩn" },
                    { icon: "warning", color: "text-yellow-500", text: "Từ khóa trọng tâm chưa có trong đoạn đầu" },
                    { icon: "check", color: "text-green-500", text: "Thẻ alt ảnh có chứa từ khóa" },
                    { icon: "cancel", color: "text-red-500", text: "Nội dung quá ngắn (tối thiểu 300 từ)" },
                  ].map(({ icon, color, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      {icon === "check" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${color}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {icon === "warning" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${color}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {icon === "cancel" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${color}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-xs font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-8 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Chưa lưu thay đổi
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Xem trước
            </button>
            <button
              type="button"
              className="px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Lưu nháp
            </button>
            <button
              type="submit"
              className="bg-[#ee2b5b] text-white px-8 py-2 text-sm font-bold rounded-lg shadow-lg shadow-[#ee2b5b]/20 hover:bg-[#d42552] transition-all"
            >
              Đăng sản phẩm
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}