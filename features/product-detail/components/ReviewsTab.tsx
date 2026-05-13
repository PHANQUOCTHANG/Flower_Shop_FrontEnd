import React, { useRef, useEffect } from "react";
import { Star, Image as ImageIcon, Video as VideoIcon, Loader2, ChevronDown } from "lucide-react";
import { useProductReviews } from "@/features/product-detail/hooks/useProductReviews";
import { ProductReview } from "@/features/product-detail/types";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface ReviewsTabProps {
  slug: string;
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

// Thumbnail ảnh/video không bị vỡ — dùng <img> native với object-cover
function MediaThumb({
  media,
  index,
}: {
  media: { url: string; type: "image" | "video" };
  index: number;
}) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => media.type === "image" && setLightboxOpen(true)}
        className={[
          "relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group block shrink-0",
          media.type === "image" ? "cursor-zoom-in" : "cursor-default",
        ].join(" ")}
        aria-label={media.type === "image" ? `Xem ảnh ${index + 1}` : `Video ${index + 1}`}
      >
        {media.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.url}
            alt={`Ảnh đánh giá ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://res.cloudinary.com/dvp98f98f/image/upload/v1713672000/placeholder_flower.png";
            }}
          />
        ) : (
          <video
            src={media.url}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        )}

        {/* Icon overlay */}
        <div className="absolute top-1 left-1 bg-black/50 rounded p-0.5 pointer-events-none">
          {media.type === "image" ? (
            <ImageIcon size={10} className="text-white" />
          ) : (
            <VideoIcon size={10} className="text-white" />
          )}
        </div>
      </button>

      {/* Lightbox — chỉ cho ảnh */}
      {lightboxOpen && media.type === "image" && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.url}
            alt={`Ảnh đánh giá ${index + 1}`}
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-xl bg-black/40 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
      )}
    </>
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
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {review.user.avatar ? (
            <OptimizedImage
              src={review.user.avatar}
              alt={review.user.fullName}
              width={36}
              height={36}
              className="rounded-full border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#13ec5b]/20 flex items-center justify-center text-sm font-bold text-[#0d8a36] shrink-0">
              {review.user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-gray-900">{review.user.fullName}</p>
            <StarRow rating={review.rating} />
          </div>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{date}</span>
      </div>

      {/* Nội dung */}
      {review.content && (
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.content}</p>
      )}

      {/* Media preview */}
      {review.media.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {review.media.map((m, i) => (
            <MediaThumb key={i} media={m} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// Skeleton loading card
function ReviewSkeleton() {
  return (
    <div className="py-5 border-b border-gray-100 animate-pulse">
      <div className="flex gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-1/2 bg-gray-200 rounded" />
    </div>
  );
}

// Component chính
export const ReviewsTab: React.FC<ReviewsTabProps> = ({ slug }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProductReviews({ slug });

  // Tích lũy tất cả reviews từ tất cả các page đã load
  const allReviews = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  // Lấy stats từ backend (tính trên toàn bộ reviews, không chỉ trang hiện tại)
  const stats = data?.pages[0]?.stats;
  const avgRating = stats?.avgRating ?? 0;
  const starCounts = stats?.starCounts ?? [5, 4, 3, 2, 1].map((s) => ({ star: s, count: 0 }));

  // Khi load thêm reviews xong → scroll nhẹ xuống để show nội dung mới
  useEffect(() => {
    if (!isFetchingNextPage && scrollRef.current) {
      // Không scroll về đầu, chỉ scroll thêm xuống 1 đoạn nhỏ
      scrollRef.current.scrollBy({ top: 120, behavior: "smooth" });
    }
  }, [isFetchingNextPage]);

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
            <RatingBar key={star} star={star} count={count} total={allReviews.length} />
          ))}
        </div>
      </div>

      {/* Vùng scrollable cố định */}
      <div className="flex flex-col gap-0">
        {/* Container scroll — giới hạn chiều cao, scroll nội bộ */}
        <div
          ref={scrollRef}
          className="overflow-y-auto pr-1"
          style={{
            maxHeight: "520px",
            // Custom scrollbar styling
            scrollbarWidth: "thin",
            scrollbarColor: "#13ec5b #f1f5f9",
          }}
        >
          {/* Loading skeleton lần đầu */}
          {isLoading && (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          )}

          {/* Error */}
          {isError && (
            <p className="text-center text-sm text-red-500 py-8">
              Không thể tải đánh giá. Vui lòng thử lại.
            </p>
          )}

          {/* Danh sách reviews tích lũy */}
          {!isLoading && !isError && (
            <>
              {allReviews.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">
                  Chưa có đánh giá nào cho sản phẩm này.
                </p>
              ) : (
                <div>
                  {allReviews.map((rev) => (
                    <ReviewCard key={rev.id} review={rev} />
                  ))}
                </div>
              )}

              {/* Skeleton khi đang fetch thêm */}
              {isFetchingNextPage && (
                <>
                  <ReviewSkeleton />
                  <ReviewSkeleton />
                </>
              )}
            </>
          )}
        </div>

        {/* Nút Load More — nằm ngoài scroll container */}
        {hasNextPage && !isLoading && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#13ec5b]/40 text-sm font-semibold text-[#0d8a36] bg-[#13ec5b]/5 hover:bg-[#13ec5b]/10 hover:border-[#13ec5b] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <ChevronDown size={15} />
                  Xem thêm đánh giá ({total - allReviews.length} còn lại)
                </>
              )}
            </button>
          </div>
        )}

        {/* Thông báo hết review */}
        {!hasNextPage && allReviews.length > 0 && !isLoading && (
          <p className="text-center text-xs text-gray-400 pt-4">
            Đã hiển thị tất cả {total} đánh giá
          </p>
        )}
      </div>
    </div>
  );
};
