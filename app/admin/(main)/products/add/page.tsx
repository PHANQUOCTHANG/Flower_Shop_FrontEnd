"use client";

import { useState, useRef, useCallback } from "react";

/* ══════════════════════════════════════
   Rich Text Editor Component
══════════════════════════════════════ */
interface RichEditorProps {
  placeholder?: string;
  minHeight?: string;
}

function RichEditor({
  placeholder = "Nhập nội dung...",
  minHeight = "120px",
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [focused, setFocused] = useState(false);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    checkEmpty();
  };

  const checkEmpty = () => {
    const text = editorRef.current?.innerText ?? "";
    setIsEmpty(text.trim() === "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      exec("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  };

  // toolbar button helper
  const Btn = ({
    onClick,
    title,
    children,
    active = false,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-colors
        ${active ? "bg-[#ee2b5b]/10 text-[#ee2b5b]" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
    >
      {children}
    </button>
  );

  return (
    <div
      className={`rounded-lg border transition-colors overflow-hidden ${focused ? "border-[#ee2b5b] ring-1 ring-[#ee2b5b]" : "border-slate-300"}`}
    >
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50">
        {/* Text style */}
        <Btn onClick={() => exec("bold")} title="In đậm (Ctrl+B)">
          <strong>B</strong>
        </Btn>
        <Btn onClick={() => exec("italic")} title="In nghiêng (Ctrl+I)">
          <em>I</em>
        </Btn>
        <Btn onClick={() => exec("underline")} title="Gạch chân (Ctrl+U)">
          <span className="underline">U</span>
        </Btn>
        <Btn onClick={() => exec("strikeThrough")} title="Gạch ngang">
          <span className="line-through">S</span>
        </Btn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Headings */}
        <Btn onClick={() => exec("formatBlock", "h2")} title="Tiêu đề 2">
          <span className="text-xs font-bold">H2</span>
        </Btn>
        <Btn onClick={() => exec("formatBlock", "h3")} title="Tiêu đề 3">
          <span className="text-xs font-bold">H3</span>
        </Btn>
        <Btn onClick={() => exec("formatBlock", "p")} title="Đoạn văn">
          <span className="text-xs">¶</span>
        </Btn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Lists */}
        <Btn
          onClick={() => exec("insertUnorderedList")}
          title="Danh sách không thứ tự"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </Btn>
        <Btn
          onClick={() => exec("insertOrderedList")}
          title="Danh sách có thứ tự"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5h11M9 12h11M9 19h11M4 5v.01M4 12v.01M4 19v.01"
            />
          </svg>
        </Btn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Align */}
        <Btn onClick={() => exec("justifyLeft")} title="Căn trái">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h8M4 18h12"
            />
          </svg>
        </Btn>
        <Btn onClick={() => exec("justifyCenter")} title="Căn giữa">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M8 12h8M6 18h12"
            />
          </svg>
        </Btn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Link */}
        <Btn
          onClick={() => {
            const url = window.prompt("Nhập URL:");
            if (url) exec("createLink", url);
          }}
          title="Chèn liên kết"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </Btn>
        <Btn onClick={() => exec("unlink")} title="Gỡ liên kết">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </Btn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Undo / Redo */}
        <Btn onClick={() => exec("undo")} title="Hoàn tác (Ctrl+Z)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </Btn>
        <Btn onClick={() => exec("redo")} title="Làm lại (Ctrl+Y)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
            />
          </svg>
        </Btn>

        <div className="flex-1" />

        {/* Clear */}
        <Btn
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = "";
              checkEmpty();
            }
          }}
          title="Xoá tất cả"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Btn>
      </div>

      {/* Editable area */}
      <div className="relative">
        {isEmpty && (
          <div className="absolute top-3 left-3 right-3 text-slate-400 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={checkEmpty}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          style={{ minHeight }}
          className="px-3 py-3 text-sm focus:outline-none prose prose-sm max-w-none
            [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1
            [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1
            [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
            [&_a]:text-[#ee2b5b] [&_a]:underline"
        />
      </div>
    </div>
  );
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

export default function AddNewProductPage() {
  const [status, setStatus] = useState<"active" | "hidden" | "draft">("active");

  // ── Image gallery ──
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newImgs: UploadedImage[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(f),
        name: f.name,
      }));
    setImages((prev) => [...prev, ...newImgs]);
  };

  const handleGalleryDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  // ── Thumbnail ──
  const [thumbnail, setThumbnail] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [isThumbDragging, setIsThumbDragging] = useState(false);

  const handleThumbFile = (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    if (thumbnail) URL.revokeObjectURL(thumbnail.url);
    setThumbnail({ url: URL.createObjectURL(f), name: f.name });
  };

  // ── Categories ──
  const [categories, setCategories] = useState([
    "Bó hoa",
    "Hoa cưới",
    "Cây nội thất",
    "Hoa chia buồn",
    "Hoa theo mùa",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Bó hoa"]);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed))
      setCategories((prev) => [...prev, trimmed]);
    if (!selectedTags.includes(trimmed))
      setSelectedTags((prev) => [...prev, trimmed]);
    setSelectedCategory(trimmed);
    setNewCatName("");
    setShowNewCatInput(false);
  };

  const handleSelectCategory = (val: string) => {
    setSelectedCategory(val);
    if (val && !selectedTags.includes(val))
      setSelectedTags((prev) => [...prev, val]);
  };

  const handleRemoveTag = (tag: string) =>
    setSelectedTags((prev) => prev.filter((t) => t !== tag));

  // ── Meta Keywords ──
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const addKeyword = (raw: string) => {
    const trimmed = raw.trim().replace(/,+$/, "").trim();
    if (trimmed && !metaKeywords.includes(trimmed)) {
      setMetaKeywords((prev) => [...prev, trimmed]);
    }
    setKeywordInput("");
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Split by comma, add each as a tag
      const parts = keywordInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 0) return;
      setMetaKeywords((prev) => {
        const next = [...prev];
        parts.forEach((p) => {
          if (!next.includes(p)) next.push(p);
        });
        return next;
      });
      setKeywordInput("");
    } else if (
      e.key === "Backspace" &&
      keywordInput === "" &&
      metaKeywords.length > 0
    ) {
      setMetaKeywords((prev) => prev.slice(0, -1));
    }
  };

  const handleKeywordBlur = () => {
    if (keywordInput.trim()) addKeyword(keywordInput);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f6] font-sans text-slate-900 overflow-y-auto">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Quay lại"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <nav className="flex text-xs text-slate-500 gap-2 mb-1">
              <span>Sản phẩm</span>
              <span>/</span>
              <span className="text-[#ee2b5b] font-medium">Thêm mới</span>
            </nav>
            <h2 className="text-xl font-bold">Tạo sản phẩm mới</h2>
          </div>
        </div>
      </header>

      {/* ── Form ── */}
      <div className="px-8 py-8 pb-28">
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ════ Left Column ════ */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#ee2b5b]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Thông tin cơ bản
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="VD: Bó hoa oải hương nửa đêm"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Đường dẫn (Slug)
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm whitespace-nowrap">
                      bloom.shop/product/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      placeholder="bo-hoa-oai-huong-nua-dem"
                      className="flex-1 min-w-0 rounded-none rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Mô tả ngắn
                  </label>
                  <RichEditor
                    placeholder="Tóm tắt ngắn gọn cho thẻ sản phẩm..."
                    minHeight="80px"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Mô tả chi tiết
                  </label>
                  <RichEditor
                    placeholder="Câu chuyện sản phẩm, hướng dẫn chăm sóc và ghi chú về hoa..."
                    minHeight="220px"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#ee2b5b]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Giá bán
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Giá bán", name: "price" },
                  { label: "Giá so sánh", name: "comparePrice" },
                  { label: "Giá gốc", name: "costPrice" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold mb-2">
                      {label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        ₫
                      </span>
                      <input
                        type="number"
                        name={name}
                        step="1000"
                        className="pl-7 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                      />
                    </div>
                    {name === "costPrice" && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Khách hàng sẽ không thấy giá này.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#ee2b5b]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Kho hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Mã SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="FLW-LAV-001"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Số lượng tồn kho
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    defaultValue={0}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Ngưỡng tồn kho thấp
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    defaultValue={5}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Product Images (real file upload) ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-[#ee2b5b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Hình ảnh sản phẩm
                </h3>
                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  {images.length} ảnh
                </span>
              </div>

              {/* Hidden file input */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              {/* Drop zone */}
              <div
                onClick={() => galleryInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleGalleryDrop}
                className={`mb-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center py-10 gap-3 ${
                  isDragging
                    ? "border-[#ee2b5b] bg-[#ee2b5b]/5"
                    : "border-slate-200 bg-slate-50 hover:border-[#ee2b5b]/50 hover:bg-[#ee2b5b]/[0.02]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-[#ee2b5b]/10" : "bg-white border border-slate-200"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 transition-colors ${isDragging ? "text-[#ee2b5b]" : "text-slate-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    {isDragging
                      ? "Thả ảnh vào đây..."
                      : "Kéo & thả ảnh hoặc nhấn để chọn file"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, WEBP — có thể chọn nhiều file cùng lúc
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    galleryInputRef.current?.click();
                  }}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-[#ee2b5b] hover:text-[#ee2b5b] transition-colors shadow-sm"
                >
                  Chọn file
                </button>
              </div>

              {/* Uploaded images grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-[#ee2b5b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                          Chính
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors shadow"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Quick-add tile */}
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-[#ee2b5b]/50 hover:bg-[#ee2b5b]/[0.02] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ════ Right Column ════ */}
          <div className="space-y-8">
            {/* Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                Trạng thái sản phẩm
              </h3>
              <div className="space-y-3">
                {(["active", "hidden", "draft"] as const).map((val) => (
                  <label
                    key={val}
                    onClick={() => setStatus(val)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${status === val ? "bg-[#ee2b5b]/5 border-[#ee2b5b]" : "border-slate-200"}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={val}
                      checked={status === val}
                      onChange={() => setStatus(val)}
                      className="text-[#ee2b5b] focus:ring-[#ee2b5b]"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {val === "active" && "Đang hoạt động"}
                        {val === "hidden" && "Ẩn"}
                        {val === "draft" && "Bản nháp"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {val === "active" && "Hiển thị trên cửa hàng."}
                        {val === "hidden" && "Không hiển thị với khách hàng."}
                        {val === "draft" && "Đang trong quá trình soạn thảo."}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                Danh mục sản phẩm
              </h3>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleSelectCategory(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none bg-white"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCatInput((v) => !v)}
                  title="Tạo danh mục mới"
                  className={`p-2 rounded-lg transition-colors flex items-center justify-center ${showNewCatInput ? "bg-[#ee2b5b]/10 text-[#ee2b5b]" : "bg-slate-100 text-slate-600 hover:bg-[#ee2b5b]/10 hover:text-[#ee2b5b]"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 transition-transform duration-200 ${showNewCatInput ? "rotate-45" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
              {showNewCatInput && (
                <div className="mt-3 flex gap-2 items-center">
                  <div className="relative flex-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddCategory()
                      }
                      placeholder="Tên danh mục mới..."
                      autoFocus
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCatName.trim()}
                    className="px-3 py-2 bg-[#ee2b5b] text-white text-xs font-bold rounded-lg hover:bg-[#d42552] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Tạo &amp; chọn
                  </button>
                </div>
              )}
              {selectedTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#ee2b5b]/10 text-[#ee2b5b] text-[10px] font-bold rounded-full flex items-center gap-1 border border-[#ee2b5b]/20"
                    >
                      {tag.toUpperCase()}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-[#d42552] transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Thumbnail (real file upload) ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                Ảnh đại diện
              </h3>

              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleThumbFile(e.target.files);
                  e.target.value = "";
                }}
              />

              {thumbnail ? (
                <div className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 mb-3">
                  <img
                    src={thumbnail.url}
                    alt={thumbnail.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                    <button
                      type="button"
                      onClick={() => thumbInputRef.current?.click()}
                      className="bg-white text-slate-900 px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg hover:bg-slate-100 transition-colors"
                    >
                      Đổi ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(thumbnail.url);
                        setThumbnail(null);
                      }}
                      className="bg-white/20 text-white px-4 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => thumbInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsThumbDragging(true);
                  }}
                  onDragLeave={() => setIsThumbDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsThumbDragging(false);
                    handleThumbFile(e.dataTransfer.files);
                  }}
                  className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all mb-3 ${
                    isThumbDragging
                      ? "border-[#ee2b5b] bg-[#ee2b5b]/5"
                      : "border-slate-200 bg-slate-50 hover:border-[#ee2b5b]/50 hover:bg-[#ee2b5b]/[0.02]"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-8 h-8 transition-colors ${isThumbDragging ? "text-[#ee2b5b]" : "text-slate-300"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-xs font-semibold text-slate-500">
                    Nhấn hoặc kéo ảnh vào đây
                  </p>
                  <p className="text-[10px] text-slate-400">PNG, JPG, WEBP</p>
                </div>
              )}

              {thumbnail && (
                <p
                  className="text-[10px] text-slate-400 truncate"
                  title={thumbnail.name}
                >
                  📎 {thumbnail.name}
                </p>
              )}
            </div>

            {/* SEO Optimization */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#ee2b5b]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Tối ưu SEO
              </h3>
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-400 mb-2 font-medium">
                  Xem trước kết quả tìm kiếm
                </p>
                <div className="max-w-md">
                  <div className="text-[#1a0dab] text-base hover:underline cursor-pointer truncate mb-0.5">
                    Bó hoa Oải Hương Nửa Đêm - Hoa Cao Cấp | BloomShop
                  </div>
                  <div className="text-[#006621] text-xs truncate mb-1">
                    https://bloom.shop › product › bo-hoa-oai-huong-nua-dem
                  </div>
                  <div className="text-[#4d5156] text-xs line-clamp-2">
                    Bó hoa Oải Hương Nửa Đêm thủ công với cành hoa hữu cơ tươi
                    và cây xanh theo mùa cao cấp. Thích hợp làm quà tặng và liệu
                    pháp hương thơm...
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-semibold">
                      Tiêu đề Meta
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      54 / 60
                    </span>
                  </div>
                  <input
                    type="text"
                    name="metaTitle"
                    placeholder="Tiêu đề trang cho công cụ tìm kiếm"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-semibold">Mô tả Meta</label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      132 / 160
                    </span>
                  </div>
                  <textarea
                    name="metaDescription"
                    placeholder="Tóm tắt ngắn về trang..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Từ khóa Meta
                  </label>
                  {/* Tag input box */}
                  <div
                    className="min-h-[42px] w-full rounded-lg border border-slate-300 px-2 py-1.5 flex flex-wrap gap-1.5 items-center focus-within:border-[#ee2b5b] focus-within:ring-1 focus-within:ring-[#ee2b5b] cursor-text transition-colors"
                    onClick={(e) =>
                      (
                        e.currentTarget.querySelector(
                          "input",
                        ) as HTMLInputElement
                      )?.focus()
                    }
                  >
                    {metaKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-[#ee2b5b]/10 text-[#ee2b5b] border border-[#ee2b5b]/20 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMetaKeywords((prev) =>
                              prev.filter((k) => k !== kw),
                            );
                          }}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#ee2b5b]/20 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-2.5 h-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeywordKeyDown}
                      onBlur={handleKeywordBlur}
                      placeholder={
                        metaKeywords.length === 0
                          ? "oải hương, bó hoa, hoa tươi... rồi nhấn Enter"
                          : "Thêm từ khóa..."
                      }
                      className="flex-1 min-w-[120px] text-sm bg-transparent focus:outline-none py-0.5 px-1 placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Nhập nhiều từ khóa cách nhau bằng dấu{" "}
                    <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">
                      ,
                    </kbd>{" "}
                    rồi nhấn{" "}
                    <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">
                      Enter
                    </kbd>{" "}
                    để thêm.{" "}
                    <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">
                      Backspace
                    </kbd>{" "}
                    để xoá.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center justify-between">
                Phân tích SEO
                <span className="text-[#ee2b5b] text-[10px] font-bold bg-[#ee2b5b]/10 px-2 py-0.5 rounded">
                  THỜI GIAN THỰC
                </span>
              </h3>
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="stroke-slate-100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="3"
                    />
                    <path
                      stroke="#22c55e"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      strokeDasharray="85, 100"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">85</span>
                    <span className="text-[8px] font-bold text-slate-400">
                      / 100
                    </span>
                  </div>
                </div>
                <p className="text-xs font-semibold mt-2 text-green-500">
                  Điểm SEO tốt
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Mật độ từ khóa", value: "1,2%", ok: true },
                  { label: "Khả năng đọc", value: "Tốt", ok: true },
                ].map(({ label, value, ok }) => (
                  <div
                    key={label}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                      {label}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{value}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Từ khóa trọng tâm
                </label>
                <input
                  type="text"
                  defaultValue="Bó hoa oải hương"
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] focus:outline-none"
                />
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: "check",
                    color: "text-green-500",
                    text: "Từ khóa trọng tâm có trong tiêu đề SEO",
                  },
                  {
                    icon: "check",
                    color: "text-green-500",
                    text: "Độ dài mô tả Meta đạt chuẩn",
                  },
                  {
                    icon: "warning",
                    color: "text-yellow-500",
                    text: "Từ khóa trọng tâm chưa có trong đoạn đầu",
                  },
                  {
                    icon: "check",
                    color: "text-green-500",
                    text: "Thẻ alt ảnh có chứa từ khóa",
                  },
                  {
                    icon: "cancel",
                    color: "text-red-500",
                    text: "Nội dung quá ngắn (tối thiểu 300 từ)",
                  },
                ].map(({ icon, color, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    {icon === "check" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 ${color}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {icon === "warning" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 ${color}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {icon === "cancel" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 ${color}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="text-xs font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-8 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          Chưa lưu thay đổi
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Lưu nháp
          </button>
          <button
            type="submit"
            className="bg-[#ee2b5b] text-white px-8 py-2 text-sm font-bold rounded-lg shadow-lg shadow-[#ee2b5b]/20 hover:bg-[#d42552] transition-all"
          >
            Đăng sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
