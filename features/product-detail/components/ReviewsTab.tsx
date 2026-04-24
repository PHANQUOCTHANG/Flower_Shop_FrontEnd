import React, { useState } from "react";
import { Star, Image as ImageIcon, Video as VideoIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useProductReviews } from "@/features/product-detail/hooks/useProductReviews";
import { ProductReview } from "@/features/product-detail/types";

interface ReviewsTabProps {
  slug: string;
}

// Hiển thị thanh phân phối sao (5 → 1)
function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold w-3 text-right">{star}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#13ec5b] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

// Hiển thị sao
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? "fill-[#13ec5b] text-[#13ec5b]" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

// Card một đánh giá
function ReviewCard({ review }: { review: ProductReview }) {
  const date = new Date(review.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {review.user.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.fullName}
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#13ec5b]/20 flex items-center justify-center text-sm font-bold text-[#0d8a36]">
              {review.user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-gray-900">{review.user.fullName}</p>
            <StarRow rating={review.rating} />
          </div>
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      {/* Nội dung */}
      {review.content && (
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.content}</p>
      )}

      {/* Media preview */}
      {review.media.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {review.media.map((m, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
            >
              {m.type === "image" ? (
                <img src={m.url} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <video src={m.url} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-1 left-1 bg-black/50 rounded p-0.5">
                {m.type === "image" ? (
                  <ImageIcon size={10} className="text-white" />
                ) : (
                  <VideoIcon size={10} className="text-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Component chính
export const ReviewsTab: React.FC<ReviewsTabProps> = ({ slug }) => {
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  const { data, isLoading, isError } = useProductReviews({ slug, page, limit: LIMIT });

  const reviews = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  // Tính trung bình và phân phối sao từ data trang hiện tại
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  return (
    <div className="space-y-8">
      {/* Tổng quan */}
      <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50 p-8 rounded-2xl">
        {/* Điểm trung bình */}
        <div className="text-center min-w-[80px]">
          <div className="text-5xl font-black text-[#13ec5b]">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </div>
          <StarRow rating={Math.round(avgRating)} size={16} />
          <p className="text-xs text-gray-500 mt-1">
            {total > 0 ? `${total} đánh giá` : "Chưa có đánh giá"}
          </p>
        </div>

        {/* Biểu đồ phân phối sao */}
        <div className="flex-1 w-full space-y-2">
          {starCounts.map(({ star, count }) => (
            <RatingBar key={star} star={star} count={count} total={reviews.length} />
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-6 border-b border-gray-100 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-center text-sm text-red-500 py-4">
          Không thể tải đánh giá. Vui lòng thử lại.
        </p>
      )}

      {/* Danh sách */}
      {!isLoading && !isError && (
        <>
          {reviews.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              Chưa có đánh giá nào cho sản phẩm này.
            </p>
          ) : (
            <div>
              {reviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:border-[#13ec5b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-sm text-gray-600">
                Trang <span className="font-bold text-gray-900">{page}</span> / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:border-[#13ec5b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
