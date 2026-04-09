"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  SearchCode,
  CheckCheck,
  Image as ImageIcon,
  ArrowLeft,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useAdminChat } from "@/features/admin/chat/hooks";
import { useAuthStore } from "@/stores/auth.store";
import { formatTimeAgo, formatMessageTime } from "@/utils/format";

// ============ Component chính ============

export default function AdminChatPage() {
  // Trạng thái từ hook
  const {
    chats,
    selectedChat,
    messages,
    isLoading,
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

  // Trạng thái component
  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState(() => searchKeyword);

  // Ref theo dõi vị trí cuộn
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreMessagesRef = useRef(loadMoreMessages);
  const previousScrollHeightRef = useRef<number>(0);
  const previousScrollTopRef = useRef<number>(0);
  const lastChatIdRef = useRef<string | null>(null);

  // ============ Effects ============

  // Tải dữ liệu lúc đầu
  useEffect(() => {
    if (isAuthenticated) {
      loadChats();
    }
  }, [isAuthenticated, loadChats]);

  // Cập nhật input khi URL thay đổi
  useEffect(() => {
    setSearchInput(searchKeyword);
  }, [searchKeyword]);

  // Cập nhật ref khi loadMoreMessages thay đổi
  useEffect(() => {
    loadMoreMessagesRef.current = loadMoreMessages;
  }, [loadMoreMessages]);

  // Auto scroll to bottom khi có tin nhắn mới hoặc vừa mở chat
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Chiều cao phần nội dung có thể cuộn
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

    // Nếu vừa mới gửi tin, nhận tin mới khi đang ở gần cuối, hoặc mới mở chat
    if (messagesEndRef.current && (isNearBottom || messages.length <= 20)) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Giải quyết lỗi nhảy scroll lên tận cùng lúc load xong tin nhắn
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (container && previousScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - previousScrollHeightRef.current;
      
      if (heightDifference > 0 && container.scrollTop < 100) {
        container.scrollTop = previousScrollTopRef.current + heightDifference;
      }
      
      previousScrollHeightRef.current = 0;
    }
  }, [messages]);

  // Scroll listener - load thêm tin nhắn cũ
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (
          container.scrollTop < 100 &&
          !isLoading &&
          loadMoreMessagesRef.current
        ) {
          // Lưu lại vị trí cuộn trước khi load thêm
          previousScrollHeightRef.current = container.scrollHeight;
          previousScrollTopRef.current = container.scrollTop;

          loadMoreMessagesRef.current();
        }
      }, 200);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isLoading]);

  // ============ Xử lý sự kiện ============

  // Bấm nút tìm kiếm
  const handleSearchSubmit = () => {
    if (!searchInput.trim()) {
      searchChats("");
      return;
    }
    searchChats(searchInput);
  };

  // Xóa tìm kiếm (bấm X)
  const handleClearSearch = () => {
    setSearchInput("");
    searchChats("");
  };

  // Chọn chat
  const handleSelectChat = async (chatId: string) => {
    await selectChat(chatId);
  };

  // Gửi tin nhắn (Enter hoặc click)
  const handleSendMessage = async (e?: React.KeyboardEvent) => {
    if (e && e.key !== "Enter") return;
    if (e && e.shiftKey) return;

    e?.preventDefault();

    if (!messageInput.trim()) return;

    const content = messageInput.trim();
    setMessageInput("");

    await sendMessage(content);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] font-['Inter',sans-serif] text-slate-900">
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
        {/* Cột trái: Danh sách chat */}
        <div
          className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-72 lg:w-96 shrink-0 md:border-r border-slate-200 border-b md:border-b-0 flex-col bg-white`}
        >
          {/* Header và search */}
          <div className="p-3 xs:p-4 sm:p-5 md:p-6 border-b border-slate-100 flex flex-col gap-2 xs:gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-[#13ec5b]">
              <button
                onClick={() => closeChat(selectedChat?.id)}
                className="md:hidden p-1 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-slate-900 truncate">
                Tin nhắn
              </h2>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#13ec5b]/50 transition-all"
                  placeholder="Tìm khách hàng..."
                  type="text"
                />
              </div>
              {/* Nút tìm kiếm */}
              <button
                onClick={handleSearchSubmit}
                className="px-3 py-2 bg-[#13ec5b] text-[#102216] rounded-lg font-bold text-xs hover:opacity-90 transition-all"
              >
                Tìm
              </button>
              {/* Nút xóa */}
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold text-xs hover:opacity-90 transition-all"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Danh sách chat */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading && !chats.length ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader
                    className="animate-spin mx-auto mb-2 text-[#13ec5b]"
                    size={32}
                  />
                  <p className="text-xs text-slate-500">Đang tải...</p>
                </div>
              </div>
            ) : chats?.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle
                    className="mx-auto mb-2 text-slate-300"
                    size={32}
                  />
                  <p className="text-xs text-slate-500">
                    Không có cuộc hội thoại
                  </p>
                </div>
              </div>
            ) : (
              <>
                {chats?.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`p-2 xs:p-3 sm:p-4 flex gap-2 xs:gap-3 cursor-pointer transition-all border-l-4 hover:bg-slate-50 active:bg-slate-100 md:active:bg-white ${
                      selectedChat?.id === chat.id
                        ? "bg-[#13ec5b]/5 border-[#13ec5b]"
                        : "border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className="w-10 h-10 xs:w-12 xs:h-12 rounded-full object-cover border border-slate-200 bg-slate-200 flex items-center justify-center shrink-0"
                        style={{
                          backgroundImage: `url(${chat.user?.avatarUrl || "https://via.placeholder.com/48"})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="absolute bottom-0 right-0 w-2 h-2 xs:w-3 xs:h-3 bg-[#13ec5b] border-2 border-white rounded-full" />
                    </div>

                    {/* Thông tin */}
                    <div className="flex-1 overflow-hidden min-w-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <p className="text-xs xs:text-sm font-bold truncate">
                          {chat.user?.fullName || "Unknown"}
                        </p>
                        <span className="text-[9px] xs:text-[10px] text-slate-400 font-bold whitespace-nowrap shrink-0">
                          {chat.lastMessageAt
                            ? formatTimeAgo(chat.lastMessageAt)
                            : "Mới"}
                        </span>
                      </div>

                      <p className="text-[11px] xs:text-xs truncate text-slate-500 line-clamp-1">
                        {chat.lastMessage?.senderRole === "admin"
                          ? `Bạn: ${chat.lastMessage.content}`
                          : chat.lastMessage?.content || "Không có tin nhắn"}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading more indicator */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-3">
                    <Loader className="animate-spin text-[#13ec5b]" size={20} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cột phải: Chi tiết chat */}
        <div className="flex-1 hidden md:flex flex-col bg-[#f6f8f6]">
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <AlertCircle
                  className="mx-auto mb-4 text-slate-300"
                  size={40}
                />
                <p className="text-sm text-slate-500">
                  Chọn cuộc hội thoại để bắt đầu
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header chat */}
              <div className="h-20 shrink-0 px-8 flex items-center justify-between bg-white/80 border-b border-slate-200">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div
                    className="w-11 h-11 rounded-full object-cover border border-slate-100 bg-slate-200"
                    style={{
                      backgroundImage: `url(${selectedChat.user?.avatarUrl || "https://via.placeholder.com/44"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold truncate">
                      {selectedChat.user?.fullName || "Unknown"}
                    </h3>
                    <p className="text-[10px] font-bold text-[#13ec5b] uppercase">
                      Đang trực tuyến
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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

              {/* Lỗi */}
              {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-700 font-medium truncate">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Tin nhắn */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-8 space-y-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader
                        className="animate-spin mx-auto mb-3 text-[#13ec5b]"
                        size={32}
                      />
                      <p className="text-xs text-slate-500">
                        Đang tải tin nhắn...
                      </p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <AlertCircle
                        className="mx-auto mb-2 text-slate-300"
                        size={32}
                      />
                      <p className="text-sm text-slate-500">
                        Không có tin nhắn
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 bg-slate-200/50 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-widest border border-white/20">
                        Hôm nay
                      </span>
                    </div>

                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderRole === "admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[55%] flex flex-col ${
                            msg.senderRole === "admin"
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                              msg.senderRole === "admin"
                                ? "bg-[#13ec5b] text-[#102216] rounded-tr-none"
                                : "bg-white text-slate-900 rounded-tl-none border border-slate-100"
                            }`}
                          >
                            {msg.content}
                          </div>

                          <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">
                              {formatMessageTime(msg.createdAt)}
                            </span>
                            {msg.senderRole === "admin" && (
                              <CheckCheck
                                size={10}
                                className="text-[#13ec5b]"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Auto scroll to bottom */}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input tin nhắn */}
              <div className="p-6 bg-white border-t border-slate-200">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 focus-within:border-[#13ec5b] focus-within:shadow-lg focus-within:shadow-[#13ec5b]/20 transition-all shadow-sm">
                  <button className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-slate-200/50 rounded-lg transition-all shrink-0">
                    <Paperclip size={16} />
                  </button>
                  <button className="hidden sm:flex p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-slate-200/50 rounded-lg transition-all shrink-0">
                    <ImageIcon size={18} />
                  </button>

                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleSendMessage}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-400 text-slate-900 outline-none"
                    placeholder="Nhập nội dung..."
                    disabled={isLoading}
                  />

                  <button className="hidden xs:flex p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-slate-200/50 rounded-lg transition-all shrink-0">
                    <Smile size={16} />
                  </button>

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!messageInput.trim() || isLoading}
                    className="bg-[#13ec5b] text-[#102216] p-2.5 rounded-lg shadow-lg shadow-[#13ec5b]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
                <p className="hidden sm:block text-[10px] text-center text-slate-400 font-bold mt-3 uppercase tracking-widest">
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
