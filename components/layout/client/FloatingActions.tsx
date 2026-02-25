"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, X, Send } from "lucide-react";

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
          className="size-14 rounded-full bg-[#0068ff] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle size={32} />
        </button>

        {/* Phone Button */}
        <button className="size-14 rounded-full bg-[#13ec5b] text-[#0d1b12] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <Phone size={32} />
        </button>
      </div>
    </>
  );
}
