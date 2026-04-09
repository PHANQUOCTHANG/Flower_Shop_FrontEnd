import React from "react";
import { Star } from "lucide-react";
import { Review } from "../types";

interface ReviewsTabProps {
 reviews: Review[];
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews }) => {
 const averageRating = 4.8;

 return (
 <div className="space-y-8">
 {/* Tổng quát đánh giá */}
 <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50 p-8 rounded-2xl">
 {/* Điểm số */}
 <div className="text-center">
 <div className="typo-display-md text-[#13ec5b]">{averageRating}</div>
 <div className="flex gap-1 my-2 justify-center">
 {[1, 2, 3, 4, 5].map((s) => (
 <Star
 key={s}
 className={`w-4 h-4 ${
 s <= 4 ? "fill-[#13ec5b] text-[#13ec5b]" : "text-gray-300"
 }`}
 />
 ))}
 </div>
 <p className="typo-label-sm text-gray-500">
 Dựa trên {reviews.length} đánh giá
 </p>
 </div>

 {/* Biểu đồ */}
 <div className="flex-1 w-full space-y-2">
 {[5, 4, 3, 2, 1].map((num) => (
 <div key={num} className="flex items-center gap-3">
 <span className="typo-body font-bold w-3">{num}</span>
 <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
 <div
 className="h-full bg-[#13ec5b]"
 style={{
 width: num === 5 ? "80%" : num === 4 ? "15%" : "0%",
 }}
 ></div>
 </div>
 </div>
 ))}
 </div>

 {/* Nút viết đánh giá */}
 <button className="bg-white border border-[#13ec5b] text-[#13ec5b] px-6 py-3 rounded-xl font-bold hover:bg-[#13ec5b] hover:text-[#0d1b12] transition-colors whitespace-nowrap">
 Viết đánh giá
 </button>
 </div>

 {/* Danh sách đánh giá */}
 <div className="divide-y divide-gray-100 ">
 {reviews.map((rev) => (
 <div key={rev.id} className="py-6">
 <div className="flex justify-between items-start mb-2">
 {/* Tên người + sao */}
 <div>
 <p className="typo-heading-sm">{rev.user}</p>
 <div className="flex gap-1 mt-1">
 {[1, 2, 3, 4, 5].map((s) => (
 <Star
 key={s}
 className={`w-3 h-3 ${
 s <= rev.rating
 ? "fill-[#13ec5b] text-[#13ec5b]"
 : "text-gray-300"
 }`}
 />
 ))}
 </div>
 </div>
 {/* Ngày */}
 <span className="typo-caption-xs text-gray-400">{rev.date}</span>
 </div>
 {/* Nội dung */}
 <p className="typo-body text-gray-600 leading-relaxed">
 {rev.comment}
 </p>
 </div>
 ))}
 </div>
 </div>
 );
};


