"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import {
  createChatStore,
  type ChatStore,
  type ChatState,
  defaultInitState,
} from "./chat-store";

// Store API type
export type ChatStoreApi = ReturnType<typeof createChatStore>;

// Context
const ChatStoreContext = createContext<ChatStoreApi | undefined>(undefined);

// Provider props
interface ChatStoreProviderProps {
  children: ReactNode;
  initialState?: ChatState;
}

/**
 * Chat store provider - creates one store instance per provider
 * Wrap your app/(app) layout with this provider
 */
export const ChatStoreProvider = ({
  children,
  initialState,
}: ChatStoreProviderProps) => {
  const storeRef = useRef<ChatStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createChatStore(initialState ?? defaultInitState);
  }

  return (
    <ChatStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatStoreContext.Provider>
  );
};

/**
 * Hook to access the chat store with a selector
 * Must be used within ChatStoreProvider
 */
export const useChatStore = <T,>(selector: (store: ChatStore) => T): T => {
  const chatStoreContext = useContext(ChatStoreContext);

  if (!chatStoreContext) {
    throw new Error("useChatStore must be used within ChatStoreProvider");
  }

  return useStore(chatStoreContext, selector);
};

// ============================================
// Convenience Hooks
// ============================================

/**
 * Get chat open state
 */
export const useIsChatOpen = () => useChatStore((state) => state.isOpen);

/**
 * Get pending message
 */
export const usePendingMessage = () =>
  useChatStore((state) => state.pendingMessage);

/**
 * Get all chat actions
 * Actions are stable references from zustand, safe to destructure
 */
export const useChatActions = () => {
  const openChat = useChatStore((state) => state.openChat);
  const openChatWithMessage = useChatStore(
    (state) => state.openChatWithMessage,
  );
  const closeChat = useChatStore((state) => state.closeChat);
  const toggleChat = useChatStore((state) => state.toggleChat);
  const clearPendingMessage = useChatStore(
    (state) => state.clearPendingMessage,
  );

  return {
    openChat,
    openChatWithMessage,
    closeChat,
    toggleChat,
    clearPendingMessage,
  };
};
