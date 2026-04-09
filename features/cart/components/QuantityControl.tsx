import React, { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantityControlProps {
 /** Quantity đã được server confirm — dùng để sync khi prop thay đổi */
 quantity: number;
 productId: string;
 min?: number;
 max?: number;
 /** Delay debounce trước khi gọi API (ms). Default: 600 */
 debounceMs?: number;
 onUpdateQuantity: (productId: string, quantity: number) => void;
 /** Variant UI cho desktop hoặc mobile */
 variant?: "desktop" | "mobile";
}

/**
 * Component số lượng giỏ hàng với:
 * - Local state: UI cập nhật ngay lập tức khi click, không phụ thuộc API
 * - Debounce: chỉ gọi onUpdateQuantity sau khi user dừng click 600ms
 *
 * Flow:
 * Click + → localQuantity++ (ngay lập tức) → debounce timer reset
 * ...600ms sau khi click cuối → gọi onUpdateQuantity (1 lần duy nhất)
 */
export const QuantityControl: React.FC<QuantityControlProps> = ({
 quantity,
 productId,
 min = 1,
 max = 999,
 debounceMs = 600,
 onUpdateQuantity,
 variant = "desktop",
}) => {
 // Local state: UI luôn hiển thị giá trị này — thay đổi ngay lập tức
 const [localQuantity, setLocalQuantity] = useState(quantity);

 // Ref giữ giá trị mới nhất trong closure của setTimeout
 const latestQuantityRef = useRef(quantity);

 // Ref cho debounce timer
 const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 // Sync khi prop quantity thay đổi (sau rollback hoặc refetch)
 useEffect(() => {
 setLocalQuantity(quantity);
 latestQuantityRef.current = quantity;
 }, [quantity]);

 // Cleanup timer khi unmount
 useEffect(() => {
 return () => {
 if (timerRef.current) clearTimeout(timerRef.current);
 };
 }, []);

 const handleChange = (newValue: number) => {
 const clamped = Math.min(Math.max(newValue, min), max);
 if (clamped === latestQuantityRef.current) return;

 // Cập nhật UI ngay
 setLocalQuantity(clamped);
 latestQuantityRef.current = clamped;

 // Reset debounce timer — gộp nhiều click thành 1 API call
 if (timerRef.current) clearTimeout(timerRef.current);
 timerRef.current = setTimeout(() => {
 onUpdateQuantity(productId, latestQuantityRef.current);
 }, debounceMs);
 };

 const isDesktop = variant === "desktop";

 return (
 <div
 className={`flex items-center border border-[#e7cfd5] overflow-hidden bg-white 
 ${isDesktop ? "rounded-xl" : "rounded-lg h-9"}`}
 >
 <button
 onClick={() => handleChange(localQuantity - 1)}
 disabled={localQuantity <= min}
 aria-label="Giảm số lượng"
 className={`flex items-center justify-center hover:bg-[#ee2b5b]/10 transition-colors
 disabled:opacity-40 disabled:cursor-not-allowed
 ${isDesktop ? "p-2" : "px-3 h-full"}`}
 >
 <Minus className={isDesktop ? "w-3.5 h-3.5" : "w-3 h-3"} />
 </button>

 <span
 className={`text-center font-bold tabular-nums
 ${isDesktop ? "w-10 text-sm" : "w-8 text-xs"}`}
 >
 {localQuantity}
 </span>

 <button
 onClick={() => handleChange(localQuantity + 1)}
 disabled={localQuantity >= max}
 aria-label="Tăng số lượng"
 className={`flex items-center justify-center hover:bg-[#ee2b5b]/10 transition-colors
 disabled:opacity-40 disabled:cursor-not-allowed
 ${isDesktop ? "p-2" : "px-3 h-full"}`}
 >
 <Plus className={isDesktop ? "w-3.5 h-3.5" : "w-3 h-3"} />
 </button>
 </div>
 );
};

