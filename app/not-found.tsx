"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-colors duration-300 font-sans antialiased flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-10 lg:px-20 py-20 text-center">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-[#13ec5b] mb-4">
            404
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d1b12] mb-4">
            Trang không tồn tại
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg text-[#4c9a66] mb-8 max-w-lg mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui
          lòng quay lại trang chính.
        </p>

        {/* Illustration */}
        <div className="mb-12 inline-block">
          <div className="w-48 h-48 bg-gradient-to-br from-[#13ec5b]/10 to-[#e91e63]/10 rounded-full flex items-center justify-center">
            <div className="text-6xl">🌸</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-[#13ec5b] text-[#0d1b12] rounded-xl font-bold hover:bg-[#13ec5b]/90 transition-all hover:scale-105"
          >
            Về trang chính
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 border-2 border-[#13ec5b] text-[#13ec5b] rounded-xl font-bold hover:bg-[#13ec5b]/10 transition-all hover:scale-105"
          >
            Xem sản phẩm
          </Link>
        </div>

        {/* Additional Links */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Link
            href="/"
            className="text-[#4c9a66] hover:text-[#13ec5b] transition-colors"
          >
            Trang chủ
          </Link>
          <span className="text-[#4c9a66] ">•</span>
          <Link
            href="/products"
            className="text-[#4c9a66] hover:text-[#13ec5b] transition-colors"
          >
            Sản phẩm
          </Link>
          <span className="text-[#4c9a66] ">•</span>
          <Link
            href="/about"
            className="text-[#4c9a66] hover:text-[#13ec5b] transition-colors"
          >
            Về chúng tôi
          </Link>
        </div>
      </div>
    </div>
  );
}
