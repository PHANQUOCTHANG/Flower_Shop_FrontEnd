"use client";

import React, { useState, useEffect } from "react";
import { Bolt, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1920",
    badgeIcon: <Bolt className="size-4" fill="currentColor" />,
    badgeText: "GIAO HỎA TỐC 2 GIỜ",
    title: (
      <>
        Đặt hoa online – <br />
        <span className="text-[#13ec5b]">Giao nhanh</span> trong 2 giờ
      </>
    ),
    description:
      "Tươi mới mỗi ngày, thiết kế sang trọng, giao hàng tận nơi chuyên nghiệp trong khu vực nội thành.",
    primaryBtn: "ĐẶT HOA NGAY",
    secondaryBtn: "Xem mẫu mới nhất",
    primaryLink: "/products",
    secondaryLink: "/products?sort=newest",
  },
  {
    image:
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1920",
    badgeIcon: <Heart className="size-4" fill="currentColor" />,
    badgeText: "BỘ SƯU TẬP TÌNH YÊU",
    title: (
      <>
        Gửi trọn tình cảm – <br />
        <span className="text-[#e91e63]">Hoa lãng mạn</span> nhất 2024
      </>
    ),
    description:
      "Khám phá ngay bộ sưu tập hoa tươi đặc biệt dành trọn cho người thương với vô vàn ưu đãi và thiết kế độc quyền.",
    primaryBtn: "MUA NGAY",
    secondaryBtn: "Tư vấn chọn hoa",
    primaryLink: "/products?category=tinh-yeu",
    secondaryLink: "/products",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="relative h-[600px] w-full overflow-hidden group">
      {/* Slides */}
      {SLIDES.map((slide, index) => (
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
              {slide.badgeIcon}
              {slide.badgeText}
            </div>
            <h2
              className={`typo-display-lg mb-6 drop-shadow-lg transition-all duration-700 delay-500 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              {slide.title}
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
                <button className="bg-[#e91e63] text-white px-12 py-5 rounded-xl typo-button-lg hover:scale-105 transition-transform shadow-2xl shadow-[#e91e63]/40 w-full sm:w-auto text-center">
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

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {SLIDES.map((_, idx) => (
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
    </section>
  );
}
