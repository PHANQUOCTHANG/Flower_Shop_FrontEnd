"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

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
  const [messages, setMessages] = useState<
    Array<{ id: number; text: string; sender: "user" | "bot" }>
  >([
    {
      id: 1,
      text: "Xin chào! Có chuyện gì tôi có thể giúp bạn?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Mở/đóng chat
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Thêm tin nhắn của user
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user" as const,
    };
    setMessages([...messages, newMessage]);
    setInputValue("");

    // Mô phỏng phản hồi từ bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Cảm ơn bạn! Nhân viên tư vấn sẽ liên hệ với bạn sớm nhất.",
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  // Xử lý Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse-wave {
          0% {
            box-shadow: 0 0 0 0 rgba(19, 236, 91, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(19, 236, 91, 0.3);
          }
          100% {
            box-shadow: 0 0 0 20px rgba(19, 236, 91, 0);
          }
        }

        @keyframes pulse-wave-blue {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(0, 104, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 0 20px rgba(0, 104, 255, 0);
          }
        }

        .floating-pulse {
          animation: pulse-wave 2s infinite;
        }

        .floating-pulse-blue {
          animation: pulse-wave-blue 2s infinite;
        }
      `}</style>
      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-[#1a2e24] rounded-2xl shadow-2xl flex flex-col z-101">
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#0d1b12]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-[#13ec5b] text-[#0d1b12] rounded-br-none"
                      : "bg-white dark:bg-[#1a2e24] text-[#0d1b12] dark:text-white border border-gray-200 dark:border-white/10 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-white/10 p-3 bg-white dark:bg-[#1a2e24]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-100 dark:bg-[#0d1b12] text-[#0d1b12] dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/50 placeholder:text-gray-400"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#13ec5b] text-[#0d1b12] rounded-lg p-2 hover:bg-[#0da74d] transition-colors flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3">
        {/* Chat Button */}
        <button
          onClick={toggleChat}
          className="size-14 rounded-full bg-[#0068ff] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform floating-pulse-blue"
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
