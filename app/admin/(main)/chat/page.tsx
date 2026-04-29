"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, Suspense } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Image as ImageIcon,
  ArrowLeft,
  Loader,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useAdminChat } from "@/features/admin/chat/hooks";
import { useAuthStore } from "@/stores/auth.store";
import { formatTimeAgo } from "@/utils/format";

// ============ Avatar Component ============

const AVATAR_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

function getAvatarColor(name?: string) {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function UserAvatar({ avatarUrl, name, className }: { avatarUrl?: string; name?: string; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const initial = (name || "?")[0].toUpperCase();

  if (!avatarUrl || imgError) {
    return (
      <div
        className={`rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 ${className || "w-11 h-11"}`}
        style={{ backgroundColor: getAvatarColor(name) }}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={`rounded-full overflow-hidden border border-slate-200 shrink-0 ${className || "w-11 h-11"}`}>
      <img
        src={avatarUrl}
        alt={name || "Avatar"}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

// ============ Skeleton Loading ============

function ChatListSkeleton() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="p-3 sm:p-4 flex gap-3 animate-pulse">
          <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-3.5 bg-slate-200 rounded-full w-1/2 mb-2" />
            <div className="h-3 bg-slate-200 rounded-full w-5/6" />
          </div>
        </div>
      ))}
    </>
  );
}

function MessagesSkeleton() {
  return (
    <div className="space-y-4 p-8">
      {[60, 45, 75, 50, 65].map((w, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}>
          <div className="h-10 bg-slate-200 rounded-2xl" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}

// ============ Component chính ============

function AdminChatContent() {
  const {
    chats,
    selectedChat,
    messages,
    isChatLoading,
    isMessageLoading,
    isLoadingMore,
    error,
    clearError,
    loadChats,
    searchChats,
    selectChat,
    closeChat,
    sendMessage,
    loadMoreMessages,
    searchKeyword,
  } = useAdminChat();

  const { isAuthenticated } = useAuthStore();

  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState(() => searchKeyword);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreMessagesRef = useRef(loadMoreMessages);
  const prevScrollHeightRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  // ============ Effects ============

  useEffect(() => {
    if (isAuthenticated) loadChats();
  }, [isAuthenticated, loadChats]);

  useEffect(() => {
    setSearchInput(searchKeyword);
  }, [searchKeyword]);

  // Debounce search: tìm sau 300ms mỗi khi gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      searchChats(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    loadMoreMessagesRef.current = loadMoreMessages;
  }, [loadMoreMessages]);

  // Scroll xuống dưới khi có tin nhắn mới
  const scrollToBottom = useCallback((smooth = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (smooth) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!messagesContainerRef.current || messages.length === 0) return;
    const container = messagesContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

    if (isNearBottom || messages.length <= 20) {
      scrollToBottom(messages.length > 1);
    }
  }, [messages, scrollToBottom]);

  // Giữ vị trí scroll khi load thêm tin nhắn cũ
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (container && prevScrollHeightRef.current > 0) {
      const diff = container.scrollHeight - prevScrollHeightRef.current;
      if (diff > 0) container.scrollTop = diff;
      prevScrollHeightRef.current = 0;
    }
  }, [messages]);

  // Scroll listener: load thêm khi kéo lên đầu
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (container.scrollTop < 80 && !isLoadingMoreRef.current) {
          isLoadingMoreRef.current = true;
          prevScrollHeightRef.current = container.scrollHeight;
          loadMoreMessagesRef.current().finally(() => {
            isLoadingMoreRef.current = false;
          });
        }
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [selectedChat]);

  // ============ Handlers ============

  const handleSelectChat = (chatId: string) => selectChat(chatId);

  const handleSendMessage = async (e?: React.KeyboardEvent) => {
    if (e && (e.key !== "Enter" || e.shiftKey)) return;
    e?.preventDefault();
    if (!messageInput.trim()) return;
    const content = messageInput.trim();
    setMessageInput("");
    await sendMessage(content);
  };

  // ============ Render Helpers ============

  const renderDateDivider = (dateLabel: string) => (
    <div className="flex justify-center my-4">
      <span className="px-4 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-full border border-slate-200">
        {dateLabel}
      </span>
    </div>
  );

  const getDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Hôm nay";
    if (date.toDateString() === yesterday.toDateString()) return "Hôm qua";
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const dateStr = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
    return `${days[date.getDay()]}, ${dateStr}`;
  };

  // ============ JSX ============

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] font-['Inter',sans-serif] text-slate-900">
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">

        {/* ===== Cột trái: Danh sách chat ===== */}
        <div className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-72 lg:w-96 shrink-0 md:border-r border-slate-200 flex-col bg-white`}>

          {/* Header + search */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-slate-100 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => closeChat(selectedChat?.id)}
                className="md:hidden p-1 hover:bg-slate-100 rounded-lg transition-colors shrink-0 text-[#13ec5b]"
                aria-label="Quay lại"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 truncate">Tin nhắn</h2>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              <input
                id="chat-search-input"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-100 border-none rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#13ec5b]/50 transition-all outline-none"
                placeholder="Tìm khách hàng..."
                type="text"
                autoComplete="off"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Xóa tìm kiếm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </div>

          {/* Danh sách */}
          <div className="flex-1 overflow-y-auto">
            {isChatLoading && !chats.length ? (
              <ChatListSkeleton />
            ) : chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 px-4">
                <MessageSquare size={36} className="text-slate-200" />
                <p className="text-xs text-slate-400 font-medium text-center">Không có cuộc hội thoại nào</p>
              </div>
            ) : (
              <>
                {chats.map(chat => {
                  const isUnread = chat.lastMessage?.isRead === false && chat.lastMessage?.senderRole !== "admin";
                  return (
                    <div
                      key={chat.id}
                      id={`chat-item-${chat.id}`}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`p-3 sm:p-4 flex gap-3 cursor-pointer transition-all border-l-4 hover:bg-slate-50 active:bg-slate-100 ${
                        selectedChat?.id === chat.id
                          ? "bg-[#13ec5b]/5 border-[#13ec5b]"
                          : "border-transparent"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <UserAvatar
                          avatarUrl={chat.user?.avatarUrl}
                          name={chat.user?.fullName}
                          className="w-11 h-11"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#13ec5b] border-2 border-white rounded-full" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 overflow-hidden min-w-0">
                        <div className="flex justify-between items-center gap-2 mb-0.5">
                          <p className={`text-sm truncate ${isUnread ? "font-black text-slate-900" : "font-semibold text-slate-700"}`}>
                            {chat.user?.fullName || "Unknown"}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isUnread && <div className="w-2 h-2 rounded-full bg-[#13ec5b]" />}
                            <span className={`text-[10px] whitespace-nowrap ${isUnread ? "text-[#13ec5b] font-bold" : "text-slate-400"}`}>
                              {chat.lastMessageAt ? formatTimeAgo(chat.lastMessageAt) : "Mới"}
                            </span>
                          </div>
                        </div>
                        <p className={`text-xs truncate ${isUnread ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                          {chat.lastMessage?.senderRole === "admin"
                            ? `Bạn: ${chat.lastMessage.content}`
                            : chat.lastMessage?.content || "Không có tin nhắn"}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {isLoadingMore && (
                  <div className="flex justify-center py-3">
                    <Loader className="animate-spin text-[#13ec5b]" size={18} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ===== Cột phải: Chi tiết chat ===== */}
        <div className={`${selectedChat ? "flex" : "hidden md:flex"} flex-1 flex-col bg-[#f6f8f6]`}>
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500">Chọn cuộc hội thoại để bắt đầu</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header chat */}
              <div className="h-[70px] shrink-0 px-6 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => closeChat(selectedChat.id)}
                    className="md:hidden p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 shrink-0"
                    aria-label="Quay lại"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <UserAvatar
                    avatarUrl={selectedChat.user?.avatarUrl}
                    name={selectedChat.user?.fullName}
                    className="w-10 h-10"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold truncate">{selectedChat.user?.fullName || "Unknown"}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#13ec5b]" />
                      <p className="text-[10px] font-bold text-[#13ec5b] uppercase tracking-wide">Trực tuyến</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-2.5 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-lg transition-all">
                    <Phone size={16} />
                  </button>
                  <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-lg transition-all">
                    <Video size={18} />
                  </button>
                  <button className="p-2.5 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-lg transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-700 font-medium truncate">{error}</p>
                  </div>
                  <button onClick={clearError} className="text-red-400 hover:text-red-600 text-sm font-bold shrink-0">✕</button>
                </div>
              )}

              {/* Tin nhắn */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
                {isMessageLoading ? (
                  <MessagesSkeleton />
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <MessageSquare size={36} className="text-slate-200" />
                    <p className="text-sm text-slate-400">Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  <div className="px-6 py-4 space-y-1">
                    {isLoadingMore && (
                      <div className="flex justify-center py-2">
                        <Loader className="animate-spin text-[#13ec5b]" size={18} />
                      </div>
                    )}

                    {messages.map((msg, index) => {
                      const isOptimistic = msg.id.startsWith("optimistic-");
                      const currentDate = new Date(msg.createdAt);
                      const prevDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;
                      const showDivider = !prevDate || currentDate.toDateString() !== prevDate.toDateString();
                      const isAdmin = msg.senderRole === "admin";

                      // Nhóm tin nhắn liên tiếp (không hiển thị avatar trùng)
                      const prevMsg = index > 0 ? messages[index - 1] : null;
                      const isFirstInGroup = !prevMsg || prevMsg.senderRole !== msg.senderRole;

                      return (
                        <React.Fragment key={msg.id}>
                          {showDivider && renderDateDivider(getDateLabel(currentDate))}

                          <div className={`flex items-end gap-2 ${isAdmin ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-4" : "mt-0.5"}`}>
                            {/* Avatar phía khách */}
                            {!isAdmin && (
                              <div className="shrink-0 mb-0.5">
                                {isFirstInGroup ? (
                                  <UserAvatar
                                    avatarUrl={selectedChat.user?.avatarUrl}
                                    name={selectedChat.user?.fullName}
                                    className="w-7 h-7"
                                  />
                                ) : (
                                  <div className="w-7 h-7" />
                                )}
                              </div>
                            )}

                            <div className={`max-w-[60%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                              <div
                                id={`msg-${msg.id}`}
                                onClick={() => setActiveMessageId(prev => prev === msg.id ? null : msg.id)}
                                className={`px-4 py-2.5 text-sm font-medium cursor-pointer select-none transition-all
                                  ${isAdmin
                                    ? `bg-[#13ec5b] text-[#102216] rounded-2xl rounded-br-sm ${isFirstInGroup ? "rounded-tr-2xl" : ""} ${isOptimistic ? "opacity-60" : ""}`
                                    : "bg-white text-slate-900 rounded-2xl rounded-bl-sm border border-slate-100 shadow-sm"
                                  }
                                  hover:opacity-90 active:scale-[0.98]`}
                              >
                                {msg.content}
                                {isOptimistic && <span className="ml-1 text-[10px] opacity-60">✓</span>}
                              </div>

                              {/* Thời gian (show khi click) */}
                              <div className={`flex items-center gap-1 px-1 overflow-hidden transition-all duration-200 ${
                                activeMessageId === msg.id ? "max-h-8 opacity-100 mt-1" : "max-h-0 opacity-0"
                              }`}>
                                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                  {new Intl.DateTimeFormat("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                  }).format(currentDate)}
                                </span>
                                {isAdmin && <CheckCheck size={11} className="text-[#13ec5b]" />}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} className="h-2" />
                  </div>
                )}
              </div>

              {/* Input tin nhắn */}
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 rounded-2xl border border-slate-200 focus-within:border-[#13ec5b] focus-within:shadow-lg focus-within:shadow-[#13ec5b]/20 transition-all">
                  <button className="p-1.5 text-slate-400 hover:text-[#13ec5b] rounded-lg transition-all shrink-0">
                    <Paperclip size={16} />
                  </button>
                  <button className="hidden sm:flex p-1.5 text-slate-400 hover:text-[#13ec5b] rounded-lg transition-all shrink-0">
                    <ImageIcon size={16} />
                  </button>

                  <input
                    id="chat-message-input"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={handleSendMessage}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-400 text-slate-900 outline-none"
                    placeholder="Nhập nội dung..."
                    disabled={isMessageLoading}
                    autoComplete="off"
                  />

                  <button className="hidden xs:flex p-1.5 text-slate-400 hover:text-[#13ec5b] rounded-lg transition-all shrink-0">
                    <Smile size={16} />
                  </button>

                  <button
                    id="chat-send-button"
                    onClick={() => handleSendMessage()}
                    disabled={!messageInput.trim() || isMessageLoading}
                    className="bg-[#13ec5b] text-[#102216] p-2 rounded-xl shadow-md shadow-[#13ec5b]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0 flex items-center justify-center"
                  >
                    <Send size={15} />
                  </button>
                </div>
                <p className="hidden sm:block text-[10px] text-center text-slate-400 font-medium mt-2 uppercase tracking-widest">
                  Nhấn Enter để gửi
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin text-[#13ec5b]" size={32} />
      </div>
    }>
      <AdminChatContent />
    </Suspense>
  );
}
