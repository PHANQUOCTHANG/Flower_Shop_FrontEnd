"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useChat } from "@/features/auth/chat/hooks/useChat";
import { useAuthStore } from "@/stores/auth.store";

// Zalo Icon Component
const ZaloIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 2C11.85 2 2 11.85 2 24c0 6.27 2.7 11.91 7 15.81v6.19h6.19c3.9 4.3 9.54 7 15.81 7 12.15 0 22-9.85 22-22S36.15 2 24 2zm0 4c9.94 0 18 8.06 18 18s-8.06 18-18 18-18-8.06-18-18 8.06-18 18-18z" />
    <path d="M20 18h8v2h-8v-2zm0 5h8v2h-8v-2zm0 5h5v2h-5v-2z" />
  </svg>
);

export default function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);

  // Ref để scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreMessagesRef = useRef<(() => Promise<void>) | null>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const previousScrollTopRef = useRef<number>(0);

  // Auth store
  const { isAuthenticated } = useAuthStore();

  const {
    messages,
    isLoading,
    error,
    openChat,
    sendMessage,
    closeChat,
    clearError,
    loadMoreMessages,
  } = useChat();

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

  // Phục hồi vị trí cuộn khi load thêm tin nhắn cũ
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (container && previousScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const heightDifference =
        newScrollHeight - previousScrollHeightRef.current;

      // Nếu thêm tin nhắn vào mốc trên cùng
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

  // Mở/đóng hộp thoại chat
  const toggleChat = async () => {
    // Nếu chưa login thì không mở chat
    if (!isChatOpen && !isAuthenticated) {
      console.warn(
        "[FloatingActions] User not authenticated, cannot open chat",
      );
      return;
    }

    if (!isChatOpen) {
      setIsInitializing(true);
      try {
        await openChat();
      } finally {
        setIsInitializing(false);
      }
    } else {
      closeChat();
    }
    setIsChatOpen(!isChatOpen);
  };

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    try {
      await sendMessage(inputValue);
      setInputValue("");
      clearError();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Xử lý phím Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse-wave {
          0% { box-shadow: 0 0 0 0 rgba(19, 236, 91, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(19, 236, 91, 0.3); }
          100% { box-shadow: 0 0 0 20px rgba(19, 236, 91, 0); }
        }
        @keyframes pulse-wave-blue {
          0% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(0, 104, 255, 0.3); }
          100% { box-shadow: 0 0 0 20px rgba(0, 104, 255, 0); }
        }
        .floating-pulse { animation: pulse-wave 2s infinite; }
        .floating-pulse-blue { animation: pulse-wave-blue 2s infinite; }
      `}</style>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-101">
          {/* Header */}
          <div className="bg-linear-to-r from-[#13ec5b] to-[#0d9a3d] text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold">FlowerShop Chat</h3>
              <p className="text-xs opacity-90">
                Chúng tôi thường trả lời trong vài phút
              </p>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#13ec5b]" />
                <p className="text-sm text-gray-500 mt-2">Đang tải chat...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
              <div className="text-center">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={() => {
                    clearError();
                    openChat();
                  }}
                  className="mt-3 px-4 py-2 bg-[#13ec5b] text-[#0d1b12] rounded-lg text-xs font-medium hover:bg-[#0da74d]"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          {!isLoading && !error && (
            <>
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
              >
                {messages.length === 0 ? (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-lg text-sm bg-white text-[#0d1b12] border border-gray-200 rounded-bl-none">
                      Xin chào! 👋 Tôi có thể giúp gì cho bạn?
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderRole === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                          msg.senderRole === "user"
                            ? "bg-[#13ec5b] text-[#0d1b12] rounded-br-none font-medium"
                            : "bg-white text-[#0d1b12] border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                        <div className="text-xs opacity-60 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {/* Ref để auto scroll */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-3 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    disabled={isInitializing}
                    className="flex-1 bg-gray-100 text-[#0d1b12] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/50 placeholder:text-gray-400 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isInitializing || !inputValue.trim()}
                    className="bg-[#13ec5b] text-[#0d1b12] rounded-lg p-2 hover:bg-[#0da74d] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3">
        {/* Chat Button */}
        <button
          onClick={toggleChat}
          disabled={isInitializing || !isAuthenticated}
          title={!isAuthenticated ? "Đăng nhập để sử dụng chat" : "Mở chat"}
          className="size-14 rounded-full bg-[#0068ff] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform floating-pulse-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <MessageCircle size={32} />
        </button>

        {/* Zalo Button */}
        <a
          href="https://zalo.me/0931838465"
          target="_blank"
          rel="noopener noreferrer"
          className="size-14 rounded-full bg-[#13ec5b] text-[#0d1b12] flex items-center justify-center shadow-lg hover:scale-110 transition-transform floating-pulse"
        >
          <ZaloIcon />
        </a>
      </div>
    </>
  );
}
