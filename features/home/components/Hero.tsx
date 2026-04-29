"use client";

import React, { useState, useEffect } from "react";
import { Bolt, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { useSettingStore } from "@/stores/setting.store";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const settings = useSettingStore((state) => state.settings);
  
  const slides = settings?.homeBanners || [
    {
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1920",
      badgeText: "GIAO HỎA TỐC 2 GIỜ",
      title: "Đặt hoa online – Giao nhanh trong 2 giờ",
      titleHighlight: "Giao nhanh",
      description: "Tươi mới mỗi ngày, thiết kế sang trọng, giao hàng tận nơi chuyên nghiệp trong khu vực nội thành.",
      primaryBtn: "ĐẶT HOA NGAY",
      secondaryBtn: "Xem mẫu mới nhất",
      primaryLink: "/products",
      secondaryLink: "/products?sort=newest",
    },
    {
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1920",
      badgeText: "BỘ SƯU TẬP TÌNH YÊU",
      title: "Gửi trọn tình cảm – Hoa lãng mạn nhất 2024",
      titleHighlight: "Hoa lãng mạn",
      description: "Khám phá ngay bộ sưu tập hoa tươi đặc biệt dành trọn cho người thương với vô vàn ưu đãi và thiết kế độc quyền.",
      primaryBtn: "MUA NGAY",
      secondaryBtn: "Tư vấn chọn hoa",
      primaryLink: "/products?category=tinh-yeu",
      secondaryLink: "/products",
    },
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderTitle = (title: string, highlight: string) => {
    if (!title) return "";
    if (!highlight) return title;
    const parts = title.split(highlight);
    return parts.reduce((acc: any[], part, i) => {
      acc.push(part);
      if (i < parts.length - 1) {
        acc.push(<span key={i} className="text-[#13ec5b]">{highlight}</span>);
      }
      return acc;
    }, []);
  };

  return (
    <section className="relative min-h-[520px] h-[65vh] max-h-[750px] w-full overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Image with slow zoom effect */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-linear"
            style={{
              backgroundImage: `url("${slide.image}")`,
              transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="relative h-full max-w-[1280px] mx-auto px-4 sm:px-10 lg:px-20 flex flex-col justify-center items-start text-white">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white typo-caption-xs mb-6 w-fit transition-all duration-700 delay-300 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              {index % 2 === 0 ? <Bolt size={16} fill="currentColor" /> : <Heart size={16} fill="currentColor" />}
              {slide.badgeText}
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-5 drop-shadow-lg transition-all duration-700 delay-500 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              {renderTitle(slide.title, slide.titleHighlight)}
            </h2>
            <p
              className={`typo-body-lg text-white/90 mb-8 max-w-xl drop-shadow-md transition-all duration-700 delay-700 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              {slide.description}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-1000 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <Link href={slide.primaryLink}>
                <button className="bg-[#13ec5b] text-[#0d1b12] px-10 py-4 rounded-xl font-black text-sm tracking-wide uppercase hover:scale-105 hover:shadow-[0_8px_30px_rgba(19,236,91,0.4)] transition-all shadow-xl w-full sm:w-auto text-center">
                  {slide.primaryBtn}
                </button>
              </Link>
              <Link href={slide.secondaryLink}>
                <button className="flex items-center justify-center gap-2 border-2 border-white/80 backdrop-blur-sm text-white px-8 py-5 rounded-xl typo-button hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
                  {slide.secondaryBtn}
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide Indicators (Dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-500 rounded-full h-2 ${
                idx === currentSlide
                  ? "w-8 bg-[#13ec5b]"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
