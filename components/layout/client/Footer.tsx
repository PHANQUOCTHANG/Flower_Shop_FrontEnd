"use client";

import React from "react";
import { Instagram, Mail, Facebook, MapPin, Phone, ChevronRight } from "lucide-react";

// Tự định nghĩa SVG cho TikTok và Zalo (do lucide-react có thể không hỗ trợ)
const TiktokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const ZaloIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 11.53a8.9 8.9 0 0 0-8.98-8.91A8.95 8.95 0 0 0 3.03 11.53a8.87 8.87 0 0 0 4.5 7.74v3.1l3.35-1.92a9.12 9.12 0 0 0 1.14.07 8.9 8.9 0 0 0 8.98-8.99zm-13.84 2.29c-.61 0-1.12-.5-1.12-1.12 0-.62.51-1.13 1.12-1.13.62 0 1.13.51 1.13 1.13 0 .62-.51 1.12-1.13 1.12zm3.3 0c-.61 0-1.12-.5-1.12-1.12 0-.62.51-1.13 1.12-1.13.62 0 1.13.51 1.13 1.13 0 .62-.51 1.12-1.13 1.12zm3.3 0c-.62 0-1.13-.5-1.13-1.12 0-.62.51-1.13 1.13-1.13.61 0 1.12.51 1.12 1.13 0 .62-.51 1.12-1.12 1.12z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e7f3eb] pt-20 pb-8">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Cột 1: Thông tin công ty & Liên hệ (Chiếm 4 cột) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-[#13ec5b]">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"/>
                </svg>
              </div>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">FlowerShop</h4>
            </div>
            
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm">
              Trạm dừng chân của những tâm hồn yêu hoa. Hệ thống đặt hoa uy tín cung cấp hàng ngàn mẫu hoa đẹp nhất mỗi ngày.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#13ec5b] shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  273 Đ. An Dương Vương, Phường 3, Quận 5, Hồ Chí Minh, Việt Nam
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#13ec5b] shrink-0" />
                <p className="text-sm font-bold text-slate-800">
                  1900 6868 <span className="text-xs font-normal text-slate-400 ml-1">(Hỗ trợ 24/7)</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#13ec5b] shrink-0" />
                <p className="text-sm font-medium text-slate-600">
                  support@flowershop.vn
                </p>
              </div>
            </div>
          </div>

          {/* Cột 2: Liên kết & Mạng xã hội (Chiếm 3 cột) */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-[#13ec5b] inline-block pb-1">
                Liên kết nhanh
              </h5>
              <ul className="space-y-3 text-sm font-medium text-slate-500">
                {["Trang chủ", "Hướng dẫn mua hàng", "Chính sách đổi trả", "Câu hỏi thường gặp (FAQ)"].map((item) => (
                  <li key={item}>
                    <a className="hover:text-[#13ec5b] transition-colors flex items-center gap-2 group" href="#">
                      <span className="w-0 h-0.5 bg-[#13ec5b] transition-all group-hover:w-3"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                Kết nối với chúng tôi
              </h5>
              <div className="flex flex-wrap gap-3">
                <a className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm" href="#" title="Facebook">
                  <Facebook size={18} />
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all shadow-sm" href="#" title="Instagram">
                  <Instagram size={18} />
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm" href="#" title="TikTok">
                  <TiktokIcon />
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-400 hover:text-white hover:border-blue-400 transition-all shadow-sm" href="#" title="Zalo">
                  <ZaloIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Cột 3: Bản đồ (Chiếm 5 cột) */}
          <div className="lg:col-span-5 h-full min-h-[250px] flex flex-col">
            <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-[#13ec5b] inline-block pb-1">
              Vị trí cửa hàng
            </h5>
            <div className="flex-1 w-full flex-grow rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.651037812557!2d106.67914751525983!3d10.757579192334065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3ed289%3A0xa06651894598e488!2s273%20An%20D.%20V%C6%B0%C6%A1ng%2C%20Ph%C6%B0%E1%BB%9Dng%203%2C%20Qu%E1%BA%ADn%205%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1sen!2s!4v1680509614488!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: "250px" }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Bản Tin & Copyright Row */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-center text-center">  
            <p className="text-xs font-bold text-slate-400">
              © 2024 FlowerShop. Thiết kế bởi UI Designer. Tích hợp bởi Antigravity.
            </p>
        </div>
      </div>
    </footer>
  );
}


