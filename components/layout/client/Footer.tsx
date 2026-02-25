"use client";

import React from "react";
import { Instagram, Mail, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#102216] border-t border-[#e7f3eb] dark:border-white/10 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="text-[#13ec5b] size-6">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h4 className="typo-heading-md">FlowerShop</h4>
            </div>
            <p className="typo-body-sm text-gray-500 mb-6 leading-relaxed">
              Hệ thống đặt hoa online uy tín hàng đầu Việt Nam. Chúng tôi cam
              kết mang lại những trải nghiệm tốt nhất cho khách hàng.
            </p>
            <div className="flex gap-4">
              <a
                className="size-9 rounded-full bg-[#e7f3eb] dark:bg-white/10 flex items-center justify-center text-[#0d1b12] dark:text-white hover:bg-[#13ec5b] transition-colors"
                href="#"
              >
                <Facebook size={18} />
              </a>
              <a
                className="size-9 rounded-full bg-[#e7f3eb] dark:bg-white/10 flex items-center justify-center text-[#0d1b12] dark:text-white hover:bg-[#13ec5b] transition-colors"
                href="#"
              >
                <Instagram size={18} />
              </a>
              <a
                className="size-9 rounded-full bg-[#e7f3eb] dark:bg-white/10 flex items-center justify-center text-[#0d1b12] dark:text-white hover:bg-[#13ec5b] transition-colors"
                href="#"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div>
            <h5 className="typo-body-lg font-bold mb-6 text-[#0d1b12] dark:text-white">
              Chăm sóc khách hàng
            </h5>
            <ul className="space-y-3 typo-body-sm text-gray-500">
              <li>
                <a className="hover:text-[#13ec5b]" href="#">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a className="hover:text-[#13ec5b]" href="#">
                  Chính sách thanh toán
                </a>
              </li>
              <li>
                <a className="hover:text-[#13ec5b]" href="#">
                  Chính sách vận chuyển
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="typo-body-lg font-bold mb-6 text-[#0d1b12] dark:text-white">
              Liên kết nhanh
            </h5>
            <ul className="space-y-3 typo-body-sm text-gray-500">
              <li>
                <a className="hover:text-[#13ec5b]" href="#">
                  Trang chủ
                </a>
              </li>
              <li>
                <a className="hover:text-[#13ec5b]" href="#">
                  Sản phẩm
                </a>
              </li>
              <li>
                <a className="hover:text-[#13ec5b]" href="#">
                  Khuyến mãi
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="typo-body-lg font-bold mb-6 text-[#0d1b12] dark:text-white">
              Bản tin
            </h5>
            <p className="typo-body-sm text-gray-500 mb-4">
              Đăng ký nhận tin tức hoa tươi hàng tuần.
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#e7f3eb] dark:bg-white/5 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#13ec5b] outline-none"
                placeholder="Email của bạn"
                type="email"
              />
              <button className="bg-[#13ec5b] text-[#0d1b12] px-4 py-2 rounded-lg typo-button-sm hover:brightness-110">
                Gửi
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[#e7f3eb] dark:border-white/10 text-center text-xs text-gray-400">
          <p className="typo-caption-xs text-gray-400">
            © 2024 FlowerShop. Thuết kế bởi UI Designer. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
