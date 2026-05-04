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
  Star,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { useSettingStore } from "@/stores/setting.store";

// Map icon names to components
const ICON_MAP: Record<string, any> = {
  Leaf,
  Paintbrush,
  Zap,
  Star,
  ShieldCheck,
  Heart,
  MapPin,
  PhoneCall,
  Mail,
  Clock,
};

// --- Interfaces & Types ---
interface ValueItem {
  title: string;
  description: string;
  iconName: string;
}

// --- Component con: Thẻ giá trị cốt lõi ---
const ValueCard: FC<{ item: ValueItem }> = ({ item }) => {
  const Icon = ICON_MAP[item.iconName] || Star;
  return (
    <div className="group p-8 rounded-[2rem] border border-[#EE2B5B]/10 hover:border-[#EE2B5B]/30 transition-all bg-[#f8f6f6] text-center hover:shadow-xl hover:shadow-[#EE2B5B]/5">
      <div className="size-20 bg-[#EE2B5B]/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-[#EE2B5B] transition-all duration-500 group-hover:scale-110">
        <Icon
          size={32}
          className="text-[#EE2B5B] group-hover:text-white transition-colors"
        />
      </div>
      <h3 className="text-2xl font-black mb-4 text-slate-900 uppercase tracking-tight">
        {item.title}
      </h3>
      <p className="text-slate-500 leading-relaxed font-medium">
        {item.description}
      </p>
    </div>
  );
};

// --- Component chính: App ---
export default function App() {
  const { settings } = useSettingStore();
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Default values
  const defaultAbout = {
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000",
    badgeText: "Về chúng tôi",
    title: "Câu chuyện của chúng tôi",
    titleItalic: "chúng tôi",
    description: [
      "Khởi nguồn từ niềm đam mê mãnh liệt với vẻ đẹp thuần khiết của những đóa hoa, Flower Shop không chỉ là một cửa hàng, mà là nơi những cảm xúc được kết tinh qua đôi bàn tay khéo léo.",
      "Suốt hơn 10 năm qua, chúng tôi đã đồng hành cùng hàng ngàn khách hàng trong những khoảnh khắc đáng nhớ nhất, mang sứ mệnh kết nối những tâm hồn qua ngôn ngữ của cái đẹp."
    ],
    coreValues: [
      {
        title: "Hoa tươi nhập mới",
        description: "Chúng tôi tuyển chọn khắt khe những bông hoa tươi nhất từ các nông trại uy tín quốc tế và Đà Lạt mỗi sớm mai.",
        iconName: "Leaf"
      },
      {
        title: "Thiết kế độc bản",
        description: "Mỗi bó hoa là một tác phẩm nghệ thuật riêng biệt, được cá nhân hóa theo phong cách và thông điệp bạn muốn gửi gắm.",
        iconName: "Paintbrush"
      },
      {
        title: "Giao hoa hỏa tốc",
        description: "Cam kết giao hàng trong 60-120 phút nội thành, đảm bảo hoa luôn giữ được độ tươi mới khi đến tay người nhận.",
        iconName: "Zap"
      }
    ]
  };

  // Robust merging: only use setting if it's not empty/null
  const sAbout = settings?.aboutPage;
  const aboutPage = {
    heroImage: sAbout?.heroImage || defaultAbout.heroImage,
    badgeText: sAbout?.badgeText || defaultAbout.badgeText,
    title: sAbout?.title || defaultAbout.title,
    titleItalic: sAbout?.titleItalic || defaultAbout.titleItalic,
    description: (sAbout?.description && sAbout.description.length > 0) ? sAbout.description : defaultAbout.description,
    coreValues: (sAbout?.coreValues && sAbout.coreValues.length > 0) ? sAbout.coreValues : defaultAbout.coreValues,
  };

  const shopConfig = settings?.shopConfig || {
    phone: "1900 6868",
    email: "support@flowershop.vn",
    address: "273 Đ. An Dương Vương, Phường 3, Quận 5, Hồ Chí Minh, Việt Nam",
    mapIframeUrl: ""
  };

  const contactDetails = [
    { title: "Địa chỉ", content: shopConfig.address, icon: MapPin },
    { title: "Hotline", content: shopConfig.phone, icon: PhoneCall },
    { title: "Email", content: shopConfig.email, icon: Mail },
    { title: "Giờ mở cửa", content: "Tất cả các ngày: 08:00 - 21:00", icon: Clock },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu gửi đi:", formState);
  };

  const renderTitle = (title: string, italic: string) => {
    if (!title) return "";
    if (!italic) return title;
    
    // Split by the italic word and join with the styled span
    const parts = title.split(italic);
    return parts.reduce((acc: any[], part, i) => {
      acc.push(part);
      if (i < parts.length - 1) {
        acc.push(<span key={i} className="text-[#EE2B5B] italic font-medium">{italic}</span>);
      }
      return acc;
    }, []);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f6] font-['Plus_Jakarta_Sans',_sans-serif] text-slate-900 transition-colors duration-500">
      <main>
        {/* 1. Hero Section: Câu chuyện của chúng tôi */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-20 md:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center">
            {/* Khung ảnh nghệ thuật */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute -top-6 -left-6 size-20 sm:size-24 md:size-32 bg-[#EE2B5B]/10 rounded-full blur-3xl group-hover:bg-[#EE2B5B]/20 transition-all"></div>
              <div className="absolute -bottom-6 -right-6 size-24 sm:size-32 md:size-40 bg-[#EE2B5B]/10 rounded-full blur-3xl group-hover:bg-[#EE2B5B]/20 transition-all"></div>
              <div className="aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden shadow-2xl z-10 relative border-8 border-white ">
                <img
                  src={aboutPage.heroImage}
                  alt="About Us"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
              </div>
            </div>

            {/* Nội dung chữ */}
            <div className="w-full lg:w-1/2 space-y-10 animate-in fade-in slide-in-from-right-10 duration-1000">
              <div className="space-y-6">
                <span className="text-[#EE2B5B] font-black tracking-[0.3em] uppercase text-xs">
                  {aboutPage.badgeText}
                </span>
                <h1 className="text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] tracking-tighter">
                  {renderTitle(aboutPage.title, aboutPage.titleItalic)}
                </h1>
                <div className="w-24 h-1.5 bg-[#EE2B5B] rounded-full"></div>
              </div>
              <div className="space-y-6 text-slate-500 leading-loose text-lg font-medium italic">
                {Array.isArray(aboutPage.description) && aboutPage.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <button className="bg-[#EE2B5B] text-white px-10 py-5 rounded-2xl font-black hover:translate-y-[-4px] transition-all shadow-2xl shadow-[#EE2B5B]/30 inline-flex items-center gap-4 group">
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
        <section className="bg-white py-12 sm:py-20 md:py-24 lg:py-32 border-y border-[#13ec5b]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 text-center">
            <div className="mb-20 space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-900 tracking-tight">
                Giá trị cốt lõi
              </h2>
              <p className="text-[#EE2B5B] font-bold italic tracking-widest uppercase text-xs">
                Tận tâm trong từng công đoạn
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
              {Array.isArray(aboutPage.coreValues) && aboutPage.coreValues.map((val: any, idx: number) => (
                <ValueCard key={idx} item={val} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Contact & Map Section: Liên hệ và Bản đồ */}
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-20 md:py-24 lg:py-32"
          id="contact"
        >
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-900 tracking-tight">
              Liên hệ & Bản đồ
            </h2>
            <p className="text-slate-500 font-medium italic">
              Để lại lời nhắn để được các nghệ nhân tư vấn tốt nhất.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-14 lg:gap-16 items-stretch">
            {/* Cột trái: Thông tin & Form */}
            <div className="w-full lg:w-[45%] space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                {contactDetails.map((detail, idx) => (
                  <div key={idx} className="space-y-3 group">
                    <h4 className="font-black text-[#EE2B5B] flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                      <detail.icon size={18} />
                      {detail.title}
                    </h4>
                    <p className="text-slate-600 text-sm font-bold leading-relaxed">
                      {detail.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Form liên hệ */}
              <form
                onSubmit={handleFormSubmit}
                className="space-y-6 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-[#EE2B5B]/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 size-32 bg-[#EE2B5B]/5 rounded-bl-full -z-0"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 rounded-xl border-slate-100 bg-slate-50 focus:border-[#EE2B5B] focus:ring-0 font-bold transition-all text-sm px-4"
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
                      className="w-full h-12 rounded-xl border-slate-100 bg-slate-50 focus:border-[#EE2B5B] focus:ring-0 font-bold transition-all text-sm px-4"
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
                    className="w-full h-12 rounded-xl border-slate-100 bg-slate-50 focus:border-[#13ec5b] focus:ring-0 font-bold transition-all text-sm px-4"
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
                    className="w-full rounded-xl border-slate-100 bg-slate-50 focus:border-[#13ec5b] focus:ring-0 font-bold transition-all text-sm px-4 py-3 resize-none"
                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                    rows={4}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#EE2B5B] text-white py-5 rounded-2xl font-black hover:bg-[#B3163B] transition-all shadow-xl shadow-[#EE2B5B]/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm relative z-10 active:scale-95"
                >
                  <Send size={20} />
                  GỬI LỜI NHẮN NGAY
                </button>
              </form>
            </div>

            {/* Cột phải: Bản đồ */}
            <div className="w-full lg:w-[55%] min-h-[600px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative border-8 border-white group animate-in zoom-in-95 duration-1000">
              {shopConfig.mapIframeUrl ? (
                <iframe
                  src={shopConfig.mapIframeUrl}
                  className="w-full h-full border-none grayscale hover:grayscale-0 transition-all duration-1000"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                  Bản đồ chưa được cấu hình
                </div>
              )}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-[#EE2B5B] shadow-2xl pointer-events-none border border-[#EE2B5B]/10">
                VỊ TRÍ FLAGSHIP STORE
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
