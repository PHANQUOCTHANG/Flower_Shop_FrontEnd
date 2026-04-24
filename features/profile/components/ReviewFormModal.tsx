"use client";

import React, { useState, useRef } from "react";
import {
  Star,
  Upload,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import { useCreateReview } from "@/features/profile/hooks/useReview";
import Alert from "@/components/ui/Alert";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  orderId: string;
  onSuccess?: () => void;
}

// LocalFile: giữ file gốc + object URL để preview (không upload trước)
interface LocalFile {
  file: File;
  preview: string; // URL.createObjectURL
  type: "image" | "video";
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  orderId,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createReview, isPending } = useCreateReview();

  const resetForm = () => {
    // Giải phóng object URL để tránh memory leak
    localFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setRating(5);
    setContent("");
    setLocalFiles([]);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleClose = () => {
    if (isPending) return;
    resetForm();
    onClose();
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = 5 - localFiles.length;
    if (remaining <= 0) {
      setErrorMessage("Tối đa 5 tệp media");
      return;
    }

    setErrorMessage("");

    const newFiles: LocalFile[] = [];

    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        const isImage = file.type.startsWith("image");
        const isVideo = file.type.startsWith("video");

        if (!isImage && !isVideo) {
          setErrorMessage("Chỉ cho phép ảnh hoặc video");
          return;
        }

        newFiles.push({
          file,
          preview: URL.createObjectURL(file),
          type: isImage ? "image" : "video",
        });
      });

    if (newFiles.length > 0) {
      setLocalFiles((prev) => [...prev, ...newFiles]);
    }

    // Reset input để chọn lại cùng tên file
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setLocalFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Submit: gửi file thực tế kèm form fields — backend multer xử lý upload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createReview(
      {
        productId,
        orderId: orderId || undefined,
        rating,
        content: content.trim() || undefined,
        files: localFiles.map((f) => f.file),
      },
      {
        onSuccess: () => {
          setSuccessMessage("Đánh giá của bạn đã được gửi thành công!");
          setTimeout(() => {
            onSuccess?.();
            resetForm();
            onClose();
          }, 1500);
        },
        onError: (err) => {
          setErrorMessage(err?.message || "Lỗi khi gửi đánh giá");
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#13ec5b]/5 to-[#ee2b5b]/5 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">Đánh giá sản phẩm</h2>
            <p className="text-sm text-slate-500 mt-1">{productName}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="text-slate-500 hover:text-slate-700 text-2xl transition-colors disabled:opacity-50"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alerts */}
          {errorMessage && (
            <Alert type="error" message={errorMessage} onClose={() => setErrorMessage("")} />
          )}
          {successMessage && (
            <Alert
              type="success"
              message={successMessage}
              onClose={() => setSuccessMessage("")}
            />
          )}

          {/* Product Preview */}
          {productImage && (
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-slate-200">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{productName}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Vui lòng chia sẻ trải nghiệm của bạn
                </p>
              </div>
            </div>
          )}

          {/* Star Rating */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
              Đánh giá của bạn
            </label>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    disabled={isPending}
                    className="transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= rating ? "fill-[#FFD700] text-[#FFD700]" : "text-slate-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-black text-slate-600 ml-2">{rating}/5 sao</span>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label
              htmlFor="review-content"
              className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block"
            >
              Nhận xét chi tiết (Tùy chọn)
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              maxLength={1000}
              disabled={isPending}
              className="w-full h-24 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b] resize-none text-sm disabled:bg-slate-50 disabled:opacity-50"
            />
            <p className="text-xs text-slate-400 mt-1">{content.length}/1000 ký tự</p>
          </div>

          {/* Media Section */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
              Thêm ảnh hoặc video (Tùy chọn)
            </label>

            {/* Upload Zone — ẩn khi đã đủ 5 file */}
            {localFiles.length < 5 && (
              <div
                onClick={() => !isPending && fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#13ec5b] hover:bg-[#13ec5b]/5 transition-all"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">Chọn ảnh hoặc video</p>
                <p className="text-xs text-slate-400 mt-1">
                  Còn {5 - localFiles.length} tệp · JPG, PNG, MP4, WebM
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  disabled={isPending}
                  className="hidden"
                />
              </div>
            )}

            {/* Preview Grid — hiện preview local, chưa upload */}
            {localFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {localFiles.map((item, index) => (
                  <div
                    key={`${item.preview}-${index}`}
                    className="relative group rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <video
                        src={item.preview}
                        className="w-full h-24 object-cover"
                        controls={false}
                      />
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-1 left-1 bg-black/60 text-white rounded px-2 py-1 flex items-center gap-1 text-xs">
                      {item.type === "image" ? (
                        <ImageIcon size={12} />
                      ) : (
                        <VideoIcon size={12} />
                      )}
                      {item.type === "image" ? "Ảnh" : "Video"}
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isPending}
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-400 mt-2">{localFiles.length}/5 tệp đã chọn</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 bg-slate-200 text-slate-900 font-black py-2.5 rounded-lg hover:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-[#13ec5b] to-[#0db34b] text-[#102216] font-black py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isPending ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
