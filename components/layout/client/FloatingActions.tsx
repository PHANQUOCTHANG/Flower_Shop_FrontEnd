"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Headphones,
  ChevronDown,
  Loader2,
  Sparkles,
  Paperclip,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useChat } from "@/features/chat/hooks/useChat";
import { useAIChat } from "@/features/chat/hooks/useAIChat";
import { useAuthStore } from "@/stores/auth.store";
import { useSettingStore } from "@/stores/setting.store";
import Image from "next/image";
import { Message } from "@/features/chat/services/chatService";
import { chatService } from "@/features/chat/services/chatService";

// ─── Types ────────────────────────────────────────────────────────────────────
type ChatMode = "admin" | "ai";

// ─── Shared helpers ───────────────────────────────────────────────────────────
const getDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Hôm nay";
  if (date.toDateString() === yesterday.toDateString()) return "Hôm qua";
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dateStr = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  return `${days[date.getDay()]}, ${dateStr}`;
};

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

// ─── AI Typing Indicator ──────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-start gap-2 justify-start">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Bot size={13} className="text-white" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Media Content Renderer ───────────────────────────────────────────────────
function MediaContent({ msg, isUser }: { msg: Message; isUser: boolean }) {
  const { mediaUrl, mediaType, mediaName, mediaSize, content } = msg;

  if (!mediaUrl) return <span className="whitespace-pre-wrap leading-relaxed">{content}</span>;

  if (mediaType === "image") {
    return (
      <div className="flex flex-col gap-2">
        <img
          src={mediaUrl}
          alt="Hình ảnh"
          className="max-w-full rounded-xl object-cover cursor-pointer hover:opacity-95 transition-opacity"
          onClick={(e) => { e.stopPropagation(); window.open(mediaUrl, "_blank"); }}
        />
        {content && <span className={`text-sm px-1 ${isUser ? "text-white" : "text-gray-800"}`}>{content}</span>}
      </div>
    );
  }

  if (mediaType === "video") {
    return (
      <div className="flex flex-col gap-2">
        <video src={mediaUrl} controls className="max-w-full rounded-xl" />
        {content && <span className={`text-sm px-1 ${isUser ? "text-white" : "text-gray-800"}`}>{content}</span>}
      </div>
    );
  }

  // File Zalo-style card
  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <a
        href={mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm group"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform flex-shrink-0">
          <FileText size={20} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-bold text-gray-700 truncate max-w-[140px]">
            {mediaName || "Tập tin"}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {mediaType} • {formatFileSize(mediaSize)}
          </span>
        </div>
      </a>
      {content && <span className={`text-sm px-1 font-medium ${isUser ? "text-white" : "text-gray-800"}`}>{content}</span>}
    </div>
  );
}

// ─── Message Bubble (shared) ──────────────────────────────────────────────────
interface MessageBubbleProps {
  msg: Message;
  isUser: boolean;
  mode: ChatMode;
  isActive: boolean;
  onClick: () => void;
}

function MessageBubble({ msg, isUser, mode, isActive, onClick }: MessageBubbleProps) {
  const date = new Date(msg.createdAt);
  const isAI = mode === "ai";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-0.5`}>
      {/* Avatar cho bot */}
      {!isUser && isAI && (
        <div className="flex items-end gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mb-0.5 shadow-sm">
            <Bot size={11} className="text-white" />
          </div>
          <div onClick={onClick} className={`max-w-[85%] px-3.5 py-2.5 text-sm rounded-2xl rounded-bl-sm transition-all duration-150 active:scale-[0.98] leading-relaxed shadow-sm hover:shadow-md
            ${msg.mediaUrl ? "bg-transparent !p-0 border-none !shadow-none" : "bg-white border border-gray-100 text-gray-800"}
          `}>
            <MediaContent msg={msg} isUser={false} />
          </div>
        </div>
      )}

      {!isUser && !isAI && (
        <div onClick={onClick} className={`max-w-[85%] px-3.5 py-2.5 text-sm rounded-2xl rounded-bl-sm transition-all duration-150 active:scale-[0.98] leading-relaxed shadow-sm hover:shadow-md
          ${msg.mediaUrl ? "bg-transparent !p-0 border-none !shadow-none" : "bg-white border border-gray-100 text-gray-800"}
        `}>
          <MediaContent msg={msg} isUser={false} />
        </div>
      )}

      {isUser && (
        <div onClick={onClick} className={`max-w-[85%] px-3.5 py-2.5 text-sm rounded-2xl rounded-br-sm cursor-pointer transition-all duration-150 active:scale-[0.98] leading-relaxed shadow-sm hover:shadow-md
          ${msg.mediaUrl 
            ? "bg-transparent !p-0 border-none !shadow-none" 
            : (isAI
                ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium"
                : "bg-gradient-to-br from-emerald-400 to-green-500 text-white font-medium"
              )
          }
        `}>
          <MediaContent msg={msg} isUser={true} />
        </div>
      )}

      {/* Timestamp */}
      <div className={`overflow-hidden transition-all duration-200 px-1 ${
        isActive ? "max-h-5 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <span className="text-[10px] text-gray-400 font-medium">{formatTime(date)}</span>
      </div>
    </div>
  );
}

// ─── Chat Panel (shared layout) ───────────────────────────────────────────────
interface ChatPanelProps {
  mode: ChatMode;
  messages: Message[];
  isLoading: boolean;
  isAITyping?: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
  onSend: (content: string, mediaUrl?: string, mediaType?: string, mediaName?: string, mediaSize?: number) => Promise<void>;
  onLoadMore: () => Promise<void>;
  clearError: () => void;
  inputPlaceholder: string;
  welcomeMessage: string;
  headerSubtitle: string;
}

function ChatPanel({
  mode,
  messages,
  isLoading,
  isAITyping,
  error,
  onClose,
  onRetry,
  onSend,
  onLoadMore,
  clearError,
  inputPlaceholder,
  welcomeMessage,
  headerSubtitle,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const loadMoreRef = useRef(onLoadMore);

  const isAI = mode === "ai";

  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // Auto-scroll to bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 180;
    if (nearBottom || messages.length <= 20) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAITyping]);

  // Restore scroll after load more
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container && prevScrollHeightRef.current > 0) {
      const diff = container.scrollHeight - prevScrollHeightRef.current;
      if (diff > 0 && container.scrollTop < 100) {
        container.scrollTop = prevScrollTopRef.current + diff;
      }
      prevScrollHeightRef.current = 0;
    }
  }, [messages]);

  // Scroll listener for load more
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let timer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (container.scrollTop < 100 && !isLoading) {
          prevScrollHeightRef.current = container.scrollHeight;
          prevScrollTopRef.current = container.scrollTop;
          loadMoreRef.current();
        }
      }, 200);
    };
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [isLoading]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => { if (pendingPreview) URL.revokeObjectURL(pendingPreview); };
  }, [pendingPreview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Tạo preview URL nếu là ảnh/video
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setPendingPreview(URL.createObjectURL(file));
    } else {
      setPendingPreview(null);
    }
    setPendingFile(file);
    // Reset input để có thể chọn lại file cũ
    e.target.value = "";
  };

  const clearPendingFile = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingFile) || isSending) return;
    const content = input.trim();
    setInput("");
    setIsSending(true);

    try {
      if (pendingFile) {
        // Upload file trước, gửi tin nhắn kèm media (cả admin và AI chat)
        setUploadProgress(true);
        const uploaded = await chatService.uploadMedia(pendingFile);
        clearPendingFile();
        setUploadProgress(false);
        await onSend(content, uploaded.url, uploaded.mediaType, uploaded.originalName, uploaded.size);
      } else {
        await onSend(content);
      }
      clearError();
    } catch {
      setUploadProgress(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const grouped: { date: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const label = getDateLabel(new Date(msg.createdAt));
    const last = grouped[grouped.length - 1];
    if (last && last.date === label) {
      last.messages.push(msg);
    } else {
      grouped.push({ date: label, messages: [msg] });
    }
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={`relative flex items-center justify-between px-4 py-3 rounded-t-2xl ${
          isAI
            ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"
            : "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
        }`}
      >
        {/* Decorative glows */}
        <div className="absolute inset-0 rounded-t-2xl overflow-hidden pointer-events-none">
          <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-40 ${isAI ? "bg-indigo-300" : "bg-emerald-200"}`} />
        </div>

        <div className="flex items-center gap-3 relative">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${isAI ? "bg-white/20" : "bg-white/20"}`}>
            {isAI ? (
              <Bot size={18} className="text-white" />
            ) : (
              <Headphones size={18} className="text-white" />
            )}
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              {isAI ? "Rosie AI" : "Hỗ trợ khách hàng"}
            </p>
            <p className="text-white/75 text-[11px] leading-tight">{headerSubtitle}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="relative w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2
              className={`mx-auto animate-spin ${isAI ? "text-violet-500" : "text-emerald-500"}`}
              size={28}
            />
            <p className="text-xs text-gray-400 mt-2 font-medium">Đang tải...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <X size={20} className="text-red-400" />
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{error}</p>
            <button
              onClick={() => { clearError(); onRetry(); }}
              className={`px-5 py-2 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90 ${isAI ? "bg-violet-500" : "bg-emerald-500"}`}
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50/80 scrollbar-thin"
          >
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex flex-col items-start gap-2">
                {isAI && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Bot size={13} className="text-white" />
                  </div>
                )}
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-gray-100 shadow-sm text-sm text-gray-700 leading-relaxed">
                  {welcomeMessage}
                </div>
              </div>
            )}

            {/* Grouped messages */}
            {grouped.map((group) => (
              <React.Fragment key={group.date}>
                {/* Date divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2">
                    {group.date}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {group.messages.map((msg) => {
                  const isUser = msg.senderRole === "user";
                  return (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isUser={isUser}
                      mode={mode}
                      isActive={activeMessageId === msg.id}
                      onClick={() =>
                        setActiveMessageId((p) =>
                          p === msg.id ? null : msg.id,
                        )
                      }
                    />
                  );
                })}
              </React.Fragment>
            ))}

            {/* AI typing indicator */}
            {isAITyping && <TypingDots />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-100 px-3 py-3 bg-white rounded-b-2xl">
            {/* File preview */}
            {pendingFile && (
              <div className="mb-2 p-2 bg-gray-100 rounded-xl flex items-center gap-2 relative">
                {pendingFile.type.startsWith("image/") && pendingPreview ? (
                  <img src={pendingPreview} alt="preview" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ) : pendingFile.type.startsWith("video/") && pendingPreview ? (
                  <video src={pendingPreview} className="w-12 h-12 rounded-lg object-cover shrink-0" muted />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{pendingFile.name}</p>
                  <p className="text-[10px] text-gray-400">{(pendingFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button onClick={clearPendingFile} className="w-5 h-5 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center shrink-0 transition-colors">
                  <X size={10} />
                </button>
              </div>
            )}

            {/* Upload progress */}
            {uploadProgress && (
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 px-1">
                <Loader2 size={12} className={`animate-spin ${isAI ? "text-violet-500" : "text-emerald-500"}`} />
                <span>Đang tải file lên...</span>
              </div>
            )}

            <div className="flex items-end gap-2">
              {/* File attachment (cả admin và AI chat) */}
              <>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect}
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                  title="Đính kèm file"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0 ${
                    isAI
                      ? "text-gray-400 hover:text-violet-500 hover:bg-violet-50"
                      : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
                  }`}
                >
                  <Paperclip size={16} />
                </button>
              </>
              <textarea
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder={pendingFile ? "Thêm chú thích (tuỳ chọn)..." : inputPlaceholder}
                disabled={isSending}
                className="flex-1 resize-none bg-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50 leading-relaxed max-h-20 overflow-y-auto"
                style={{ height: "40px" }}
              />
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !pendingFile) || isSending}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${
                  isAI
                    ? "bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                    : "bg-gradient-to-br from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600"
                } flex-shrink-0`}
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              {isAI
                ? "Nhấn Enter để gửi • Shift+Enter xuống dòng"
                : "Hỗ trợ 24/7 • Thường trả lời trong vài phút"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}


// ─── Main FloatingActions ─────────────────────────────────────────────────────
export default function FloatingActions() {
  const [activeChatMode, setActiveChatMode] = useState<ChatMode | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const settings = useSettingStore((s) => s.settings);

  const chatSettings = settings?.chatSettings || {
    welcomeMessage: "Xin chào! 👋 Tôi có thể giúp gì cho bạn?",
    waitMessage: "Thường trả lời trong vài phút",
  };
  const socialLinks = settings?.socialLinks || {
    zalo: "https://zalo.me/0931838465",
  };

  // Admin chat hook
  const adminChat = useChat();
  // AI chat hook
  const aiChat = useAIChat();

  // Đóng khi đăng xuất
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveChatMode(null);
      adminChat.closeChat();
      aiChat.closeChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const openChatMode = useCallback(
    async (mode: ChatMode) => {
      if (!isAuthenticated) return;
      setIsInitializing(true);
      setActiveChatMode(mode);
      try {
        if (mode === "admin") await adminChat.openChat();
        else await aiChat.openChat();
      } finally {
        setIsInitializing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated],
  );

  const closeActiveChat = useCallback(() => {
    if (activeChatMode === "admin") adminChat.closeChat();
    else if (activeChatMode === "ai") aiChat.closeChat();
    setActiveChatMode(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatMode]);

  const activeHook = activeChatMode === "admin" ? adminChat : aiChat;

  return (
    <>
      {/* ── Keyframes & global styles ── */}
      <style>{`
        @keyframes float-up {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes chat-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes pulse-green {
          0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.5); }
          50%      { box-shadow: 0 0 0 10px rgba(52,211,153,0); }
        }
        @keyframes pulse-violet {
          0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
          50%      { box-shadow: 0 0 0 10px rgba(167,139,250,0); }
        }
        .fa-menu-item { animation: float-up 0.2s ease both; }
        .fa-chat-panel { animation: chat-in 0.25s cubic-bezier(.22,.68,0,1.2) both; }
        .fa-pulse-green { animation: pulse-green 2.5s infinite; }
        .fa-pulse-violet { animation: pulse-violet 2.5s infinite; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 9999px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>

      {/* ── Chat Panel ── */}
      {activeChatMode && (
        <div
          className="fa-chat-panel fixed bottom-28 right-6 w-[340px] h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[101] border border-gray-100"
          style={{ boxShadow: "0 25px 60px -10px rgba(0,0,0,0.18), 0 10px 30px -5px rgba(0,0,0,0.12)" }}
        >
          <ChatPanel
            mode={activeChatMode}
            messages={activeHook.messages}
            isLoading={activeHook.isLoading || isInitializing}
            isAITyping={activeChatMode === "ai" ? (aiChat as any).isAITyping : false}
            error={activeHook.error}
            onClose={closeActiveChat}
            onRetry={() => openChatMode(activeChatMode)}
            onSend={activeHook.sendMessage}
            onLoadMore={activeHook.loadMoreMessages}
            clearError={activeHook.clearError}
            inputPlaceholder={
              activeChatMode === "ai"
                ? "Hỏi Rosie về hoa, giá cả..."
                : "Nhắn tin cho chúng tôi..."
            }
            welcomeMessage={
              activeChatMode === "ai"
                ? "Xin chào! Tôi là Rosie 🌸 Bạn cần tư vấn về hoa, giá cả hay dịp tặng phù hợp không?"
                : chatSettings.welcomeMessage
            }
            headerSubtitle={
              activeChatMode === "ai"
                ? "Trợ lý AI · Phản hồi tức thì"
                : chatSettings.waitMessage
            }
          />
        </div>
      )}

      {/* ── Chat Actions & FABs ── */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
        
        {/* Chỉ hiện các nút khi không có khung chat nào đang mở */}
        {!activeChatMode && (
          <div className="flex flex-col items-end gap-4 pointer-events-auto">
            {/* AI Chat option */}
            <div
              className="fa-menu-item flex items-center gap-4 cursor-pointer group"
              style={{ animationDelay: "0.2s" }}
              onClick={() => isAuthenticated && openChatMode("ai")}
            >
              <div className="opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100/50 group-hover:shadow-[0_10px_30px_-5px_rgba(167,139,250,0.3)] transition-all duration-300 origin-right">
                Chat với <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">AI Rosie</span>
              </div>
              <div className="w-14 h-14 flex items-center justify-center">
                <button
                  disabled={!isAuthenticated}
                  title={!isAuthenticated ? "Đăng nhập để sử dụng" : "Chat với AI"}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(167,139,250,0.4)] group-hover:scale-110 transition-transform fa-pulse-violet disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Sparkles size={24} className="text-white drop-shadow-md" />
                </button>
              </div>
            </div>

            {/* Admin Chat option */}
            <div
              className="fa-menu-item flex items-center gap-4 cursor-pointer group"
              style={{ animationDelay: "0.1s" }}
              onClick={() => isAuthenticated && openChatMode("admin")}
            >
              <div className="opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100/50 group-hover:shadow-[0_10px_30px_-5px_rgba(52,211,153,0.3)] transition-all duration-300 origin-right">
                Chat với nhân viên
              </div>
              <div className="w-14 h-14 flex items-center justify-center">
                <button
                  disabled={!isAuthenticated}
                  title={!isAuthenticated ? "Đăng nhập để sử dụng" : "Chat với nhân viên"}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(52,211,153,0.4)] group-hover:scale-110 transition-transform fa-pulse-green disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Headphones size={24} className="text-white drop-shadow-md" />
                </button>
              </div>
            </div>

            {/* Zalo option */}
            <div
              className="fa-menu-item flex items-center gap-4 cursor-pointer group"
              style={{ animationDelay: "0s" }}
            >
              <div className="opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100/50 group-hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 origin-right">
                Liên hệ Zalo
              </div>
              <div className="w-14 h-14 flex items-center justify-center">
                <a
                  href={socialLinks.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Liên hệ Zalo"
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Image
                    src="https://freepnglogo.com/images/all_img/zalo-icon-4635.png"
                    alt="Zalo"
                    width={42}
                    height={42}
                    priority={false}
                    className="object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
