"use client";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export interface RichEditorRef {
  getHTML: () => string;
  isEmpty: () => boolean;
  setHTML: (html: string) => void;
}

interface RichEditorProps {
  placeholder?: string;
  minHeight?: string;
}

const ToolbarBtn = ({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="w-7 h-7 rounded flex items-center justify-center text-sm transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
  >
    {children}
  </button>
);

const RichEditor = (
  { placeholder = "Nhập nội dung...", minHeight = "120px" }: RichEditorProps,
  ref: React.Ref<RichEditorRef | null>,
) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [focused, setFocused] = useState(false);

  const checkEmpty = () => {
    const text = editorRef.current?.innerText ?? "";
    setIsEmpty(text.trim() === "");
  };

  useImperativeHandle(ref, () => ({
    getHTML: () => editorRef.current?.innerHTML ?? "",
    isEmpty: () => {
      const text = editorRef.current?.innerText ?? "";
      return text.trim() === "";
    },
    setHTML: (html: string) => {
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        checkEmpty();
      }
    },
  }));

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    checkEmpty();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      exec("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  };

  return (
    <div
      className={`rounded-lg border transition-colors overflow-hidden ${
        focused ? "border-[#ee2b5b] ring-1 ring-[#ee2b5b]" : "border-slate-300"
      }`}
    >
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50 overflow-x-auto">
        <ToolbarBtn onClick={() => exec("bold")} title="In đậm (Ctrl+B)">
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("italic")} title="In nghiêng (Ctrl+I)">
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec("underline")}
          title="Gạch chân (Ctrl+U)"
        >
          <span className="underline">U</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("strikeThrough")} title="Gạch ngang">
          <span className="line-through">S</span>
        </ToolbarBtn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarBtn onClick={() => exec("formatBlock", "h2")} title="Tiêu đề 2">
          <span className="text-xs font-bold">H2</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("formatBlock", "h3")} title="Tiêu đề 3">
          <span className="text-xs font-bold">H3</span>
        </ToolbarBtn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarBtn
          onClick={() => exec("insertUnorderedList")}
          title="Danh sách không thứ tự"
        >
          <svg
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
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec("insertOrderedList")}
          title="Danh sách có thứ tự"
        >
          <svg
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
        </ToolbarBtn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarBtn onClick={() => exec("justifyLeft")} title="Căn trái">
          <svg
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
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("justifyCenter")} title="Căn giữa">
          <svg
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
        </ToolbarBtn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarBtn
          onClick={() => {
            const url = window.prompt("Nhập URL:");
            if (url) exec("createLink", url);
          }}
          title="Chèn liên kết"
        >
          <svg
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
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("unlink")} title="Gỡ liên kết">
          <svg
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
        </ToolbarBtn>

        <div className="flex-1" />

        <ToolbarBtn onClick={() => exec("undo")} title="Hoàn tác (Ctrl+Z)">
          <svg
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
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("redo")} title="Làm lại (Ctrl+Y)">
          <svg
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
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = "";
              checkEmpty();
            }
          }}
          title="Xoá tất cả"
        >
          <svg
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
        </ToolbarBtn>
      </div>

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
};

export default forwardRef(RichEditor);
