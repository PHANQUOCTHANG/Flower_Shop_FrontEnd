"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LazySection: chỉ render + animate children khi phần tử vào viewport.
 * — Lazy load: tránh render DOM khi chưa cần
 * — Reveal animation: fade + slide-up khi hiện ra
 */
interface LazySectionProps {
 children: React.ReactNode;
 rootMargin?: string;
 className?: string;
 placeholderHeight?: string;
 /** Animation delay (ms) */
 delay?: number;
}

export default function LazySection({
 children,
 rootMargin = "100px",
 className = "",
 placeholderHeight = "400px",
 delay = 0,
}: LazySectionProps) {
 const ref = useRef<HTMLDivElement>(null);
 const [visible, setVisible] = useState(false);
 const [revealed, setRevealed] = useState(false);

 useEffect(() => {
 const el = ref.current;
 if (!el) return;

 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 setVisible(true);
 observer.disconnect();
 }
 },
 { rootMargin },
 );

 observer.observe(el);
 return () => observer.disconnect();
 }, [rootMargin]);

 // Trigger animation sau khi render
 useEffect(() => {
 if (!visible) return;
 const t = setTimeout(() => setRevealed(true), delay);
 return () => clearTimeout(t);
 }, [visible, delay]);

 return (
 <div ref={ref} className={className}>
 {visible ? (
 <div
 style={{ transitionDelay: `${delay}ms` }}
 className={`transition-all duration-700 ease-out ${
 revealed
 ? "opacity-100 translate-y-0"
 : "opacity-0 translate-y-10"
 }`}
 >
 {children}
 </div>
 ) : (
 <div
 style={{ minHeight: placeholderHeight }}
 className="animate-pulse bg-gray-100 rounded-2xl"
 />
 )}
 </div>
 );
}


