"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminChatService,
  type ChatItem,
  type Chat,
  type Message,
} from "../services/adminChatService";
import * as socketChatService from "@/features/chat/services/socketChatService";
import { useAuthStore } from "@/stores/auth.store";
import { getSocket, initializeSocket } from "@/lib/socket";

// ============ Interface ============

interface AdminChatState {
  chats: ChatItem[];
  selectedChat: Chat | null;
  messages: Message[];
  isChatLoading: boolean;
  isMessageLoading: boolean;
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

const INIT_PAGINATION = { total: 0, page: 1, limit: 20, totalPages: 0 };

// ============ Hook chính ============

export const useAdminChat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuthStore();

  // === Refs để tránh stale closures & circular deps ===
  const searchKeywordRef = useRef(searchParams.get("search") || "");
  const isLoadingMoreRef = useRef(false);
  const selectedChatRef = useRef<Chat | null>(null);
  const hasMoreMessagesRef = useRef(false);
  const messagePaginationRef = useRef(INIT_PAGINATION);
  const chatPaginationRef = useRef(INIT_PAGINATION);

  const [state, setState] = useState<AdminChatState>({
    chats: [],
    selectedChat: null,
    messages: [],
    isChatLoading: false,
    isMessageLoading: false,
    isLoadingMore: false,
    error: null,
    searchKeyword: searchParams.get("search") || "",
    chatPagination: INIT_PAGINATION,
    messagePagination: INIT_PAGINATION,
    hasMoreMessages: false,
  });

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

  // ============ Tải danh sách chat (stable - dùng ref) ============

  const loadChats = useCallback(async (page = 1, search?: string) => {
    const keyword = search !== undefined ? search : searchKeywordRef.current;
    try {
      setState((prev) => ({ ...prev, isChatLoading: true, error: null }));
      const result = await adminChatService.getChatList({
        page,
        search: keyword.trim() ? keyword : undefined,
      });
      chatPaginationRef.current = result.pagination;
      setState((prev) => ({
        ...prev,
        chats: result.data,
        chatPagination: result.pagination,
        isChatLoading: false,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi khi tải danh sách";
      setState((prev) => ({ ...prev, isChatLoading: false, error: msg }));
    }
  }, []); // stable - không deps vào state

  // Sync URL params → state + tải lần đầu
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    searchKeywordRef.current = searchFromUrl;
    setState((prev) =>
      prev.searchKeyword === searchFromUrl
        ? prev
        : { ...prev, searchKeyword: searchFromUrl },
    );
    loadChats(1, searchFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // intentionally stable - loadChats không thay đổi

  // ============ Tải thêm danh sách chat ============

  const loadMoreChats = useCallback(async () => {
    const pagination = chatPaginationRef.current;
    const nextPage = pagination.page + 1;
    if (nextPage > pagination.totalPages) return;

    setState((prev) => ({ ...prev, isLoadingMore: true }));
    try {
      const result = await adminChatService.getChatList({
        page: nextPage,
        search: searchKeywordRef.current || undefined,
      });
      chatPaginationRef.current = result.pagination;
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
  }, []);

  // ============ Tìm kiếm ============

  const searchChats = useCallback(
    async (keyword: string) => {
      searchKeywordRef.current = keyword;
      try {
        setState((prev) => ({
          ...prev,
          isChatLoading: true,
          error: null,
          searchKeyword: keyword,
          chats: [],
          chatPagination: INIT_PAGINATION,
        }));

        const result = await adminChatService.getChatList({
          page: 1,
          search: keyword.trim() ? keyword : undefined,
        });
        chatPaginationRef.current = result.pagination;
        setState((prev) => ({
          ...prev,
          chats: result.data,
          chatPagination: result.pagination,
          isChatLoading: false,
        }));

        if (keyword.trim()) {
          router.push(`?search=${encodeURIComponent(keyword)}`);
        } else {
          router.push("/admin/chat");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Lỗi khi tìm kiếm";
        setState((prev) => ({ ...prev, isChatLoading: false, error: msg }));
      }
    },
    [router],
  );

  // ============ Lọc theo trạng thái ============

  const filterByStatus = useCallback(async (status: "ACTIVE" | "CLOSED") => {
    try {
      setState((prev) => ({ ...prev, isChatLoading: true, error: null }));
      const result = await adminChatService.filterChatsByStatus(status);
      setState((prev) => ({
        ...prev,
        chats: result.data,
        chatPagination: result.pagination,
        isChatLoading: false,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi khi lọc";
      setState((prev) => ({ ...prev, isChatLoading: false, error: msg }));
    }
  }, []);

  // ============ Chọn chat ============

  const selectChat = useCallback(async (chatId: string) => {
    try {
      setState((prev) => ({
        ...prev,
        isMessageLoading: true,
        error: null,
        messages: [],
      }));
      socketChatService.joinChatRoom(chatId);
      adminChatService
        .markAsRead(chatId)
        .catch((err) => console.error("Lỗi markAsRead:", err));

      // Optimistic: đánh dấu đã đọc trong danh sách
      setState((prev) => {
        const chats = prev.chats.map((c) =>
          c.id === chatId && c.lastMessage
            ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } }
            : c,
        );
        return { ...prev, chats };
      });

      const result = await adminChatService.getChatMessages(chatId);
      messagePaginationRef.current = result.pagination;
      hasMoreMessagesRef.current =
        result.pagination.page < result.pagination.totalPages;

      setState((prev) => {
        const chatInfo = prev.chats.find((c) => c.id === chatId);
        const selectedChat = (chatInfo as Chat) || result.chat;
        selectedChatRef.current = selectedChat;
        return {
          ...prev,
          selectedChat,
          messages: result.data,
          messagePagination: result.pagination,
          hasMoreMessages:
            result.pagination.page < result.pagination.totalPages,
          isMessageLoading: false,
        };
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi khi tải tin nhắn";
      setState((prev) => ({ ...prev, isMessageLoading: false, error: msg }));
    }
  }, []);

  // ============ Đóng chat ============

  const closeChat = useCallback((chatId?: string) => {
    if (chatId) socketChatService.leaveChatRoom(chatId);
    selectedChatRef.current = null;
    hasMoreMessagesRef.current = false;
    messagePaginationRef.current = INIT_PAGINATION;
    setState((prev) => ({
      ...prev,
      selectedChat: null,
      messages: [],
      messagePagination: INIT_PAGINATION,
      hasMoreMessages: false,
    }));
  }, []);

  // ============ Tin nhắn ============

  const addMessageFromSocket = useCallback((message: Message) => {
    setState((prev) => {
      // Tránh duplicate
      if (prev.messages.some((m) => m.id === message.id)) return prev;
      // Xóa optimistic message tương ứng (nếu có)
      const filtered = prev.messages.filter(
        (m) => !m.id.startsWith("optimistic-"),
      );
      return { ...prev, messages: [...filtered, message] };
    });
  }, []);

  const updateChatLastMessage = useCallback(
    (chatId: string, message: Message & { isRead?: boolean }) => {
      setState((prev) => ({
        ...prev,
        chats: prev.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: {
                  content: message.content ?? chat.lastMessage?.content ?? "",
                  createdAt: message.createdAt,
                  senderRole: message.senderRole,
                  isRead: message.isRead ?? false,
                  mediaUrl: message.mediaUrl,
                  mediaType: message.mediaType,
                },
                lastMessageAt: message.createdAt,
              }
            : chat,
        ),
      }));
    },
    [],
  );

  // Tải thêm tin nhắn cũ - stable via refs
  const loadMoreMessages = useCallback(async () => {
    if (
      !selectedChatRef.current ||
      !hasMoreMessagesRef.current ||
      isLoadingMoreRef.current
    )
      return;

    isLoadingMoreRef.current = true;
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    const nextPage = messagePaginationRef.current.page + 1;
    const chatId = selectedChatRef.current.id;

    try {
      const result = await adminChatService.loadMoreMessages(chatId, nextPage);
      messagePaginationRef.current = result.pagination;
      hasMoreMessagesRef.current = nextPage < result.pagination.totalPages;

      setState((prev) => {
        const existingIds = new Set(prev.messages.map((m) => m.id));
        const newMsgs = result.data.filter((m) => !existingIds.has(m.id));
        return {
          ...prev,
          messages: [...newMsgs, ...prev.messages],
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
  }, []); // stable - dùng refs

  // Gửi tin nhắn + Optimistic UI
  const sendMessage = useCallback(
    async (
      content: string,
      mediaUrl?: string,
      mediaType?: string,
      mediaName?: string,
      mediaSize?: number,
    ) => {
      if (!content.trim() && !mediaUrl) return;
      if (!selectedChatRef.current) return;

      const chatId = selectedChatRef.current.id;
      const optimisticId = `optimistic-${Date.now()}`;

      // Thêm tin nhắn optimistic ngay lập tức
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: optimisticId,
            chatId,
            content: content || null,
            mediaUrl: mediaUrl || null,
            mediaType: mediaType || null,
            mediaName: mediaName || null,
            mediaSize: mediaSize || null,
            senderRole: "admin",
            createdAt: new Date().toISOString(),
            isRead: false,
            senderId: "",
          } as Message,
        ],
      }));

      try {
        await adminChatService.sendMessage(chatId, {
          content: content || undefined,
          mediaUrl,
          mediaType,
          mediaName,
          mediaSize,
        });
        // Socket listener sẽ thêm tin thật và xóa optimistic
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Lỗi khi gửi tin nhắn";
        setState((prev) => ({
          ...prev,
          messages: prev.messages.filter((m) => m.id !== optimisticId),
          error: msg,
        }));
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // ============ Lắng nghe Socket ============

  useEffect(() => {
    if (!state.selectedChat) return;
    const chatId = state.selectedChat.id;

    const handleNewMessage = (message: Message) => {
      if (message.chatId !== chatId) return;
      addMessageFromSocket(message);
      const isRead = message.senderRole !== "admin";
      if (isRead) {
        adminChatService
          .markAsRead(chatId)
          .catch((err) => console.error("Lỗi tự động markAsRead:", err));
      }
      updateChatLastMessage(chatId, { ...message, isRead: true });
    };

    socketChatService.listenForNewMessages(chatId, handleNewMessage);
    return () => {
      socketChatService.removeNewMessageListener();
      socketChatService.leaveChatRoom(chatId);
    };
  }, [state.selectedChat, addMessageFromSocket, updateChatLastMessage]);

  useEffect(() => {
    if (!accessToken) return;

    const handleInboxUpdate = (data: {
      chatId: string;
      lastMessage: {
        content: string;
        createdAt: string;
        mediaUrl?: string | null;
        mediaType?: string | null;
      };
      fromUserId: string;
    }) => {
      setState((prev) => {
        const idx = prev.chats.findIndex((c) => c.id === data.chatId);
        if (idx !== -1) {
          const chats = [...prev.chats];
          const chat = chats[idx];
          chats.splice(idx, 1);
          chats.unshift({
            ...chat,
            lastMessage: {
              content: data.lastMessage.content,
              createdAt: data.lastMessage.createdAt,
              senderRole: "user",
              isRead: false,
              mediaUrl: data.lastMessage.mediaUrl,
              mediaType: data.lastMessage.mediaType,
            },
            lastMessageAt: data.lastMessage.createdAt,
          });
          return { ...prev, chats };
        } else {
          setTimeout(
            () => loadChats(1, searchKeywordRef.current || undefined),
            500,
          );
          return prev;
        }
      });
    };

    socketChatService.listenForInboxUpdate(handleInboxUpdate);
    return () => {
      socketChatService.removeInboxUpdateListener();
    };
  }, [accessToken, loadChats]);

  // ============ Return ============

  // isLoading: backward compat cho page.tsx
  const isLoading = state.isChatLoading || state.isMessageLoading;

  return {
    ...state,
    isLoading,
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
