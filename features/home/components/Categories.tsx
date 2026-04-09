/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ProductCategory } from "@/features/products/types";
import ScrollReveal from "./ScrollReveal";

// Fallback ảnh theo thứ tự nếu API category không có image
const FALLBACK_IMAGES = [
 "https://images.unsplash.com/photo-1522673607200-1648830ce5c6?q=80&w=400",
 "https://images.unsplash.com/photo-1550983092-24736f4021bc?q=80&w=400",
 "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=400",
 "https://images.unsplash.com/photo-1525310235261-94527ec3186d?q=80&w=400",
 "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=400",
];

interface CategoriesProps {
 categories: ProductCategory[];
 loading?: boolean;
}

export default function Categories({ categories, loading }: CategoriesProps) {
 const scrollRef = useRef<HTMLDivElement>(null);
 const [isAtStart, setIsAtStart] = useState(true);
 const [isAtEnd, setIsAtEnd] = useState(false);

 const checkScroll = () => {
   if (!scrollRef.current) return;
   const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
   setIsAtStart(scrollLeft <= 5);
   setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
 };

 // Initial check on load and resize
 useEffect(() => {
   checkScroll();
   window.addEventListener("resize", checkScroll);
   return () => window.removeEventListener("resize", checkScroll);
 }, [categories]);

 // Auto scroll every 5 seconds
 useEffect(() => {
   if (!categories || categories.length <= 5) return;
   
   const interval = setInterval(() => {
     handleNext();
   }, 5000);
   
   return () => clearInterval(interval);
 }, [categories]);

 const getScrollAmount = () => {
   if (!scrollRef.current) return 0;
   const firstChild = scrollRef.current.children[0] as HTMLElement;
   return firstChild ? firstChild.offsetWidth + 16 : 200; // 16px is gap-4
 };

 const handleNext = () => {
   if (!scrollRef.current) return;
   const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
   const isEnd = scrollLeft + clientWidth >= scrollWidth - 10;
   
   if (isEnd) {
     scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
   } else {
     scrollRef.current.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
   }
 };

 const handlePrev = () => {
   if (!scrollRef.current) return;
   if (scrollRef.current.scrollLeft <= 0) {
     scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
   } else {
     scrollRef.current.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
   }
 };

 if (loading) {
  return (
   <section className="mb-16">
    <div className="flex items-center justify-between mb-8 px-2">
     <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />
    </div>
    <div className="flex gap-4 overflow-hidden">
     {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="aspect-square w-[calc(20%-0.8rem)] shrink-0 rounded-2xl bg-gray-200 animate-pulse" />
     ))}
    </div>
   </section>
  );
 }

 return (
  <section className="mb-16 relative group">
   <ScrollReveal variant="slide-up" delay={0}>
    <div className="flex items-center justify-between mb-8 px-2">
     <h3 className="typo-heading-lg">Danh mục sản phẩm</h3>
     <Link
      href="/products"
      className="text-[#13ec5b] typo-button-sm hover:underline flex items-center gap-1"
     >
      Xem tất cả <ArrowRight size={16} />
     </Link>
    </div>
   </ScrollReveal>

   {/* Slider Navigation Buttons */}
   {categories && categories.length > 5 && (
     <>
       {!isAtStart && (
         <button 
           onClick={handlePrev} 
           className="absolute left-0 top-[55%] -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-[2px] p-3 rounded-full shadow-lg border border-slate-100 text-slate-700 hover:text-[#ee2b5b] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
           aria-label="Previous categories"
         >
           <ChevronLeft size={24} />
         </button>
       )}
       {!isAtEnd && (
         <button 
           onClick={handleNext} 
           className="absolute right-0 top-[55%] -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-[2px] p-3 rounded-full shadow-lg border border-slate-100 text-slate-700 hover:text-[#ee2b5b] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
           aria-label="Next categories"
         >
           <ChevronRight size={24} />
         </button>
       )}
     </>
   )}

   {/* Categories Carousel */}
   <div className="relative overflow-hidden w-full -mx-2 px-2">
     <div 
       ref={scrollRef} 
       onScroll={checkScroll}
       className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
     >
      {categories.map((cat, idx) => (
       <div 
         key={cat.id} 
         className="snap-start shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(20%-0.8rem)]"
       >
        <ScrollReveal variant="scale" delay={idx * 50}>
         <Link
          href={`/products?category=${cat.slug}`}
          className="group cursor-pointer relative aspect-square overflow-hidden rounded-2xl block shadow-sm border border-slate-100"
         >
          <div
           className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
           style={{
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%), url("${cat.thumbnailUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}")`,
           }}
          />
          <div className="absolute bottom-4 left-4 right-4 text-center">
           <p className="text-white typo-heading-sm drop-shadow-md">{cat.name}</p>
          </div>
         </Link>
        </ScrollReveal>
       </div>
      ))}
     </div>
   </div>
  </section>
 );
}
