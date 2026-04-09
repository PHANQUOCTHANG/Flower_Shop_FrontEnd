"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal: animate một element khi nó scroll vào viewport.
 * Hỗ trợ: fade, slide-up, slide-left, slide-right, scale
 * Hỗ trợ delay để tạo hiệu ứng stagger cho list items.
 */
interface ScrollRevealProps {
 children: React.ReactNode;
 /** Delay (ms) — dùng để tạo stagger khi map list */
 delay?: number;
 /** Animation variant */
 variant?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale";
 /** Class CSS thêm vào wrapper */
 className?: string;
 rootMargin?: string;
 /** Duration class Tailwind (default: duration-700) */
 duration?: "duration-500" | "duration-700" | "duration-1000";
}

const HIDDEN_CLASSES: Record<NonNullable<ScrollRevealProps["variant"]>, string> = {
 "fade": "opacity-0",
 "slide-up": "opacity-0 translate-y-8",
 "slide-left": "opacity-0 translate-x-8",
 "slide-right": "opacity-0 -translate-x-8",
 "scale": "opacity-0 scale-95",
};

export default function ScrollReveal({
 children,
 delay = 0,
 variant = "slide-up",
 className = "",
 rootMargin = "0px",
 duration = "duration-700",
}: ScrollRevealProps) {
 const ref = useRef<HTMLDivElement>(null);
 const [revealed, setRevealed] = useState(false);

 useEffect(() => {
 const el = ref.current;
 if (!el) return;

 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 setTimeout(() => setRevealed(true), delay);
 observer.disconnect();
 }
 },
 { rootMargin, threshold: 0.1 },
 );

 observer.observe(el);
 return () => observer.disconnect();
 }, [delay, rootMargin]);

 return (
 <div
 ref={ref}
 className={`transition-all ease-out ${duration} ${className} ${
 revealed ? "opacity-100 translate-y-0 translate-x-0 scale-100" : HIDDEN_CLASSES[variant]
 }`}
 >
 {children}
 </div>
 );
}


