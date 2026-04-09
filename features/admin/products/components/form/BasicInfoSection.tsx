"use client";
import { forwardRef } from "react";
import RichEditor, { RichEditorRef } from "../RichEditor";

interface BasicInfoSectionProps {
  name: string;
  onNameChange: (value: string) => void;
  shortDesc: string;
  onShortDescChange: (value: string) => void;
  descRef: React.RefObject<RichEditorRef>;
}

const BasicInfoSection = forwardRef<HTMLDivElement, BasicInfoSectionProps>(
  ({ name, onNameChange, shortDesc, onShortDescChange, descRef }, ref) => {
    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold mb-6">📝 Thông tin cơ bản</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ví dụ: Bó hoa oải hương"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mô tả ngắn
            </label>
            <textarea
              value={shortDesc}
              onChange={(e) => onShortDescChange(e.target.value)}
              placeholder="Tóm tắt cho thẻ sản phẩm (chỉ nhập văn bản thuần, không cần định dạng)..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] outline-none transition-colors"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mô tả chi tiết
            </label>
            <RichEditor
              ref={descRef}
              placeholder="Câu chuyện sản phẩm, cách chăm sóc..."
              minHeight="220px"
            />
          </div>
        </div>
      </section>
    );
  },
);

BasicInfoSection.displayName = "BasicInfoSection";

export default BasicInfoSection;
