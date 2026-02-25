"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";

export default function Consultation() {
  return (
    <section className="mb-16">
      <div className="bg-[#e7f3eb] dark:bg-white/5 rounded-3xl p-8 lg:p-12 text-center border border-[#13ec5b]/20">
        <h3 className="typo-heading-lg mb-4">
          Bạn cần tư vấn chọn mẫu hoa phù hợp?
        </h3>
        <p className="typo-body text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Đừng ngần ngại liên hệ với chúng tôi, nhân viên tư vấn sẽ giúp bạn
          chọn được bó hoa ưng ý nhất cho người thân yêu.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="flex items-center gap-2 bg-[#0068ff] text-white px-8 py-4 rounded-xl typo-button hover:brightness-110 transition-all">
            <MessageCircle size={20} />
            Chat qua Zalo ngay
          </button>
          <button className="flex items-center gap-2 bg-[#13ec5b] text-[#0d1b12] px-8 py-4 rounded-xl typo-button hover:brightness-110 transition-all">
            <Phone size={20} />
            Gọi: 1900 1234
          </button>
        </div>
      </div>
    </section>
  );
}
