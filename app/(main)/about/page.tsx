"use client";

import React, { useState, FC } from "react";
import {
  ArrowRight,
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Send,
  Leaf,
  Paintbrush,
  Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

// --- Interfaces & Types ---
interface ValueItem {
  title: string;
  description: string;
  icon: any;
}

interface ContactInfo {
  title: string;
  content: string;
  icon: any;
}

// --- Dữ liệu hằng số ---
const CORE_VALUES: ValueItem[] = [
  {
    title: "Hoa tươi nhập mới",
    description:
      "Chúng tôi tuyển chọn khắt khe những bông hoa tươi nhất từ các nông trại uy tín quốc tế và Đà Lạt mỗi sớm mai.",
    icon: Leaf,
  },
  {
    title: "Thiết kế độc bản",
    description:
      "Mỗi bó hoa là một tác phẩm nghệ thuật riêng biệt, được cá nhân hóa theo phong cách và thông điệp bạn muốn gửi gắm.",
    icon: Paintbrush,
  },
  {
    title: "Giao hoa hỏa tốc",
    description:
      "Cam kết giao hàng trong 60-120 phút nội thành, đảm bảo hoa luôn giữ được độ tươi mới khi đến tay người nhận.",
    icon: Zap,
  },
];

const CONTACT_DETAILS: ContactInfo[] = [
  {
    title: "Địa chỉ",
    content: "123 Đường Hoa Hồng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    icon: MapPin,
  },
  { title: "Hotline", content: "1900 6789 - 090 123 4567", icon: PhoneCall },
  { title: "Email", content: "contact@flowershop.vn", icon: Mail },
  {
    title: "Giờ mở cửa",
    content: "Tất cả các ngày: 08:00 - 21:00",
    icon: Clock,
  },
];

// --- Component con: Thẻ giá trị cốt lõi ---
const ValueCard: FC<{ item: ValueItem }> = ({ item }) => {
  const Icon = item.icon;
  return (
    <div className="group p-8 rounded-[2rem] border border-[#ee2b5b]/10 hover:border-[#ee2b5b]/30 transition-all bg-[#f8f6f6] dark:bg-[#1a0c10]/40 text-center hover:shadow-xl hover:shadow-[#ee2b5b]/5">
      <div className="size-20 bg-[#ee2b5b]/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-[#ee2b5b] transition-all duration-500 group-hover:scale-110">
        <Icon
          size={32}
          className="text-[#ee2b5b] group-hover:text-white transition-colors"
        />
      </div>
      <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white uppercase tracking-tight">
        {item.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
        {item.description}
      </p>
    </div>
  );
};

// --- Component chính: App ---
export default function App() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu gửi đi:", formState);
    // Tích hợp logic xử lý form tại đây
  };

  return (
    <div className="min-h-screen bg-[#f8f6f6] dark:bg-[#221015] font-['Plus_Jakarta_Sans',_sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <main>
        {/* Breadcrumbs */}
        {/* <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-20">
          <Breadcrumbs
            items={[{ label: "Trang chủ", href: "/" }, { label: "Giới thiệu" }]}
          />
        </div> */}

        {/* 1. Hero Section: Câu chuyện của chúng tôi */}
        <section className="max-w-7xl mx-auto px-6 lg:px-20 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            {/* Khung ảnh nghệ thuật */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute -top-6 -left-6 size-32 bg-[#ee2b5b]/10 rounded-full blur-3xl group-hover:bg-[#ee2b5b]/20 transition-all"></div>
              <div className="absolute -bottom-6 -right-6 size-40 bg-[#ee2b5b]/10 rounded-full blur-3xl group-hover:bg-[#ee2b5b]/20 transition-all"></div>
              <div className="aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden shadow-2xl z-10 relative border-8 border-white dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000"
                  alt="Nghệ nhân đang cắm hoa"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
              </div>
            </div>

            {/* Nội dung chữ */}
            <div className="w-full lg:w-1/2 space-y-10 animate-in fade-in slide-in-from-right-10 duration-1000">
              <div className="space-y-6">
                <span className="text-[#ee2b5b] font-black tracking-[0.3em] uppercase text-xs">
                  Về chúng tôi
                </span>
                <h1 className="text-slate-900 dark:text-white text-5xl lg:text-7xl font-serif leading-[1.1] tracking-tighter">
                  Câu chuyện của <br />
                  <span className="text-[#ee2b5b] italic font-medium">
                    chúng tôi
                  </span>
                </h1>
                <div className="w-24 h-1.5 bg-[#ee2b5b] rounded-full"></div>
              </div>
              <div className="space-y-6 text-slate-500 dark:text-slate-400 leading-loose text-lg font-medium italic">
                <p>
                  Khởi nguồn từ niềm đam mê mãnh liệt với vẻ đẹp thuần khiết của
                  những đóa hoa, Flower Shop không chỉ là một cửa hàng, mà là
                  nơi những cảm xúc được kết tinh qua đôi bàn tay khéo léo.
                </p>
                <p>
                  Suốt hơn 10 năm qua, chúng tôi đã đồng hành cùng hàng ngàn
                  khách hàng trong những khoảnh khắc đáng nhớ nhất, mang sứ mệnh
                  kết nối những tâm hồn qua ngôn ngữ của cái đẹp.
                </p>
              </div>
              <button className="bg-[#ee2b5b] text-white px-10 py-5 rounded-2xl font-black hover:translate-y-[-4px] transition-all shadow-2xl shadow-[#ee2b5b]/30 inline-flex items-center gap-4 group">
                <span>KHÁM PHÁ BỘ SƯU TẬP</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </div>
          </div>
        </section>

        {/* 2. Core Values Section: Giá trị cốt lõi */}
        <section className="bg-white dark:bg-[#1a0c10]/40 py-32 border-y border-[#ee2b5b]/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-20 text-center">
            <div className="mb-20 space-y-4">
              <h2 className="text-4xl lg:text-5xl font-serif text-slate-900 dark:text-white tracking-tight">
                Giá trị cốt lõi
              </h2>
              <p className="text-[#ee2b5b] font-bold italic tracking-widest uppercase text-xs">
                Tận tâm trong từng công đoạn
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
              {CORE_VALUES.map((val, idx) => (
                <ValueCard key={idx} item={val} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Contact & Map Section: Liên hệ và Bản đồ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-20 py-32" id="contact">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-serif text-slate-900 dark:text-white tracking-tight">
              Liên hệ & Bản đồ
            </h2>
            <p className="text-slate-500 font-medium italic">
              Để lại lời nhắn để được các nghệ nhân tư vấn tốt nhất.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-stretch">
            {/* Cột trái: Thông tin & Form */}
            <div className="w-full lg:w-[45%] space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {CONTACT_DETAILS.map((detail, idx) => (
                  <div key={idx} className="space-y-3 group">
                    <h4 className="font-black text-[#ee2b5b] flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                      <detail.icon size={18} />
                      {detail.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed">
                      {detail.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Form liên hệ */}
              <form
                onSubmit={handleFormSubmit}
                className="space-y-6 bg-white dark:bg-[#1a0c10] p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-[#ee2b5b]/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 size-32 bg-[#ee2b5b]/5 rounded-bl-full -z-0"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#221015] focus:border-[#ee2b5b] focus:ring-0 font-bold transition-all text-sm px-4"
                      placeholder="Nguyễn Văn A"
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      className="w-full h-12 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#221015] focus:border-[#ee2b5b] focus:ring-0 font-bold transition-all text-sm px-4"
                      placeholder="090 xxx xxxx"
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 relative z-10">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    className="w-full h-12 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#221015] focus:border-[#ee2b5b] focus:ring-0 font-bold transition-all text-sm px-4"
                    placeholder="example@email.com"
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 relative z-10">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Lời nhắn của bạn
                  </label>
                  <textarea
                    className="w-full rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#221015] focus:border-[#ee2b5b] focus:ring-0 font-bold transition-all text-sm px-4 py-3 resize-none"
                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                    rows={4}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#ee2b5b] text-white py-5 rounded-2xl font-black hover:bg-[#ee2b5b]/90 transition-all shadow-xl shadow-[#ee2b5b]/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm relative z-10 active:scale-95"
                >
                  <Send size={20} />
                  GỬI LỜI NHẮN NGAY
                </button>
              </form>
            </div>

            {/* Cột phải: Bản đồ */}
            <div className="w-full lg:w-[55%] min-h-[600px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative border-8 border-white dark:border-slate-800 group animate-in zoom-in-95 duration-1000">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460232428308!2d106.69747161168434!3d10.7721938591522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f4e240a5f%3A0x6739074092b7c62b!2zMTIzIEzDqiBM4bujaSwgQuG6v24gVGjDoG5oLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                className="w-full h-full border-none grayscale hover:grayscale-0 transition-all duration-1000"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-[#1a0c10]/90 backdrop-blur-md px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-[#ee2b5b] shadow-2xl pointer-events-none border border-[#ee2b5b]/10">
                VỊ TRÍ FLAGSHIP STORE
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
