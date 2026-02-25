"use client";

import React from "react";
import { Bolt } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="relative h-full max-w-[1280px] mx-auto px-4 sm:px-10 lg:px-20 flex flex-col justify-center items-start text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13ec5b] text-[#0d1b12] typo-caption-xs mb-6 w-fit">
          <Bolt className="size-4" fill="currentColor" />
          GIAO HỎA TỐC 2 GIỜ
        </div>
        <h2 className="typo-display-lg mb-6 drop-shadow-lg">
          Đặt hoa online – <br />
          <span className="text-[#13ec5b]">Giao nhanh</span> trong 2 giờ
        </h2>
        <p className="typo-body-lg text-white/90 mb-8 max-w-xl drop-shadow-md">
          Tươi mới mỗi ngày, thiết kế sang trọng, giao hàng tận nơi chuyên
          nghiệp trong khu vực nội thành.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-[#e91e63] text-white px-12 py-5 rounded-xl typo-button-lg hover:scale-105 transition-transform shadow-2xl shadow-[#e91e63]/40">
            ĐẶT HOA NGAY
          </button>
          <button className="flex items-center justify-center gap-2 border-2 border-white/80 backdrop-blur-sm text-white px-8 py-5 rounded-xl typo-button hover:bg-white/10 transition-colors">
            Xem mẫu mới nhất
          </button>
        </div>
      </div>
    </section>
  );
}
