"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminChatService,
  type ChatItem,
  type Chat,
  type Message,
} from "../services/adminChatService";
import * as socketChatService from "@/features/auth/chat/services/socketChatService";
import { useAuthStore } from "@/stores/auth.store";
import { getSocket, initializeSocket } from "@/lib/socket";

// ============ Interface ============

interface AdminChatState {
  chats: ChatItem[];
  selectedChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  searchKeyword: string;
  chatPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  messagePagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  hasMoreMessages: boolean;
}

// ============ Hook chính ============

export const useAdminChat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuthStore();

  // State chính
  const [state, setState] = useState<AdminChatState>({
    chats: [],
    selectedChat: null,
    messages: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    searchKeyword: searchParams.get("search") || "",
    chatPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    messagePagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    hasMoreMessages: false,
  });

  const isLoadingMoreRef = useRef(false);

  // ============ Khởi tạo Socket ============

  useEffect(() => {
    if (!accessToken) return;

    const socket = getSocket();
    if (!socket) {
      try {
        initializeSocket(accessToken);
      } catch (err) {
        console.error("[useAdminChat] Lỗi khởi tạo socket:", err);
      }
    }
  }, [accessToken]);

  // ============ Tải danh sách chat ============

  const loadChats = useCallback(
    async (page = 1, search?: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const result = await adminChatService.getChatList({
          page,
          search: search || state.searchKeyword || undefined,
        });

        setState((prev) => ({
          ...prev,
          chats: result.data,
          chatPagination: result.pagination,
          isLoading: false,
        }));
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Lỗi khi tải danh sách";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
      }
    },
    [state.searchKeyword],
  );

  // Tự động tải khi URL thay đổi
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setState((prev) => ({ ...prev, searchKeyword: searchFromUrl }));
    loadChats(1, searchFromUrl || undefined);
  }, [searchParams, loadChats]);

  // ============ Tải thêm danh sách ============

  const loadMoreChats = useCallback(async () => {
    try {
      const nextPage = state.chatPagination.page + 1;
      if (nextPage > state.chatPagination.totalPages) return;

      // Bật loading
      setState((prev) => ({ ...prev, isLoadingMore: true }));

      const result = await adminChatService.getChatList({
        page: nextPage,
        search: state.searchKeyword || undefined,
      });

      setState((prev) => ({
        ...prev,
        chats: [...prev.chats, ...result.data],
        chatPagination: result.pagination,
        isLoadingMore: false,
      }));
    } catch (err) {
      console.error("[useAdminChat] Lỗi tải thêm chats:", err);
      setState((prev) => ({ ...prev, isLoadingMore: false }));
    }
  }, [state.chatPagination, state.searchKeyword]);

  // ============ Tìm kiếm ============

  const searchChats = useCallback(
    async (keyword: string) => {
      try {
        // Reset state trước khi tìm kiếm
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
          searchKeyword: keyword,
          chats: [], // Xóa danh sách cũ
          chatPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
        }));

        // Gọi API trực tiếp (không đợi URL thay đổi)
        const result = await adminChatService.getChatList({
          page: 1,
          search: keyword.trim() ? keyword : undefined,
        });

        setState((prev) => ({
          ...prev,
          chats: result.data,
          chatPagination: result.pagination,
          isLoading: false,
        }));

        // Cập nhật URL sau khi API thành công
        if (keyword.trim()) {
          router.push(`?search=${encodeURIComponent(keyword)}`);
        } else {
          router.push("/admin/chat");
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Lỗi khi tìm kiếm";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
      }
    },
    [router],
  );

  // ============ Lọc theo trạng thái ============

  const filterByStatus = useCallback(async (status: "ACTIVE" | "CLOSED") => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await adminChatService.filterChatsByStatus(status);

      setState((prev) => ({
        ...prev,
        chats: result.data,
        chatPagination: result.pagination,
        isLoading: false,
      }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Lỗi khi lọc";

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
    }
  }, []);

  // ============ Chọn chat ============

  const selectChat = useCallback(
    async (chatId: string) => {
      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
          messages: [],
        }));

        // Tham gia socket room
        socketChatService.joinChatRoom(chatId);

        // Tải tin nhắn
        const result = await adminChatService.getChatMessages(chatId);
        const chatInfo = state.chats.find((c) => c.id === chatId);

        setState((prev) => ({
          ...prev,
          selectedChat: (chatInfo as Chat) || result.chat,
          messages: result.data,
          messagePagination: result.pagination,
          hasMoreMessages:
            result.pagination.page < result.pagination.totalPages,
          isLoading: false,
        }));
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Lỗi khi tải tin nhắn";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
      }
    },
    [state.chats],
  );

  // ============ Đóng chat ============

  const closeChat = useCallback((chatId?: string) => {
    if (chatId) {
      socketChatService.leaveChatRoom(chatId);
    }

    setState((prev) => ({
      ...prev,
      selectedChat: null,
      messages: [],
      messagePagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      hasMoreMessages: false,
    }));
  }, []);

  // ============ Tin nhắn ============

  // Thêm tin nhắn mới từ Socket
  const addMessageFromSocket = useCallback((message: Message) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  // Cập nhật last message trong danh sách
  const updateChatLastMessage = useCallback(
    (chatId: string, message: Message) => {
      setState((prev) => ({
        ...prev,
        chats: prev.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: {
                  content: message.content,
                  createdAt: message.createdAt,
                  senderRole: message.senderRole,
                },
                lastMessageAt: message.createdAt,
              }
            : chat,
        ),
      }));
    },
    [],
  );

  // Tải thêm tin nhắn
  const loadMoreMessages = useCallback(async () => {
    if (
      !state.selectedChat ||
      !state.hasMoreMessages ||
      isLoadingMoreRef.current
    ) {
      return;
    }

    isLoadingMoreRef.current = true;
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    const nextPage = state.messagePagination.page + 1;
    const chatId = state.selectedChat.id;

    try {
      const result = await adminChatService.loadMoreMessages(chatId, nextPage);

      setState((prev) => {
        // Dùng Set để lọc bỏ các tin nhắn bị trùng lặp id
        const existingIds = new Set(prev.messages.map((m) => m.id));
        const newFilteredMessages = result.data.filter(
          (m) => !existingIds.has(m.id),
        );

        return {
          ...prev,
          messages: [...newFilteredMessages, ...prev.messages],
          messagePagination: result.pagination,
          hasMoreMessages: nextPage < result.pagination.totalPages,
          isLoadingMore: false,
        };
      });
    } catch (err) {
      console.error("[useAdminChat] ❌ Lỗi tải thêm tin nhắn:", err);
      setState((prev) => ({ ...prev, isLoadingMore: false }));
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [state.selectedChat, state.hasMoreMessages, state.messagePagination.page]);

  // Gửi tin nhắn
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !state.selectedChat) return;

      try {
        await adminChatService.sendMessage(state.selectedChat.id, {
          content,
        });
        // Socket listener sẽ thêm tin nhắn mới
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Lỗi khi gửi tin nhắn";

        setState((prev) => ({
          ...prev,
          error: errorMsg,
        }));
      }
    },
    [state.selectedChat],
  );

  // ============ Xóa lỗi ============

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // ============ Lắng nghe Socket ============

  useEffect(() => {
    if (!state.selectedChat) return;

    const chatId = state.selectedChat.id;

    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatId) {
        addMessageFromSocket(message);
        updateChatLastMessage(chatId, message);
      }
    };

    socketChatService.listenForNewMessages(chatId, handleNewMessage);

    return () => {
      socketChatService.removeNewMessageListener();
      socketChatService.leaveChatRoom(chatId);
    };
  }, [state.selectedChat, addMessageFromSocket, updateChatLastMessage]);

  // ============ Return ============

  return {
    ...state,
    loadChats,
    loadMoreChats,
    searchChats,
    filterByStatus,
    selectChat,
    closeChat,
    loadMoreMessages,
    sendMessage,
    addMessageFromSocket,
    updateChatLastMessage,
    clearError,
  };
};
