"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import {
  createCartStore,
  type CartStore,
  type CartState,
  defaultInitState,
} from "./cart-store";

// Store API type
export type CartStoreApi = ReturnType<typeof createCartStore>;

// Context
const CartStoreContext = createContext<CartStoreApi | undefined>(undefined);

// Provider props
interface CartStoreProviderProps {
  children: ReactNode;
  initialState?: CartState;
}

/**
 * Cart store provider - creates one store instance per provider
 * Manually triggers rehydration from localStorage on the client
 * Wrap your app/(app) layout with this provider
 * @see https://zustand.docs.pmnd.rs/guides/nextjs#hydration-and-asynchronous-storages
 */
export const CartStoreProvider = ({
  children,
  initialState,
}: CartStoreProviderProps) => {
  const storeRef = useRef<CartStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createCartStore(initialState ?? defaultInitState);
  }

  // Manually trigger rehydration on the client after mount
  // This prevents SSR hydration mismatches since localStorage isn't available on server
  useEffect(() => {
    storeRef.current?.persist.rehydrate();
  }, []);

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  );
};

/**
 * Hook to access the cart store with a selector
 * Must be used within CartStoreProvider
 * Handles SSR by returning default state until hydrated
 */
export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
  const cartStoreContext = useContext(CartStoreContext);

  if (!cartStoreContext) {
    throw new Error("useCartStore must be used within CartStoreProvider");
  }

  return useStore(cartStoreContext, selector);
};

// ============================================
// Convenience Hooks
// ============================================

/**
 * Get all cart items
 */
export const useCartItems = () => useCartStore((state) => state.items);

/**
 * Get cart open state
 */
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);

/**
 * Get total number of items in cart
 */
export const useTotalItems = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

/**
 * Get total price of cart
 */
export const useTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

/**
 * Find a specific item in cart
 */
export const useCartItem = (productId: string) =>
  useCartStore((state) =>
    state.items.find((item) => item.productId === productId),
  );

/**
 * Get all cart actions
 * Actions are stable references from zustand, safe to destructure
 */
export const useCartActions = () => {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };
};
