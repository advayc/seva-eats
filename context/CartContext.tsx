import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { CartItem, MenuItem } from './types';

type CartContextType = {
  items: CartItem[];
  storeId: string | null;
  storeName: string | null;
  addItem: (item: MenuItem, storeId: string, storeName: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

const DELIVERY_FEE = 0;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  const addItem = useCallback(
    (menuItem: MenuItem, newStoreId: string, newStoreName: string) => {
      // If adding from a different store, clear cart first
      if (storeId && storeId !== newStoreId) {
        setItems([{ menuItem, quantity: 1 }]);
        setStoreId(newStoreId);
        setStoreName(newStoreName);
        return;
      }

      setStoreId(newStoreId);
      setStoreName(newStoreName);

      setItems((prev) => {
        const existing = prev.find((item) => item.menuItem.id === menuItem.id);
        if (existing) {
          return prev.map((item) =>
            item.menuItem.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { menuItem, quantity: 1 }];
      });
    },
    [storeId]
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.menuItem.id !== itemId);
      if (newItems.length === 0) {
        setStoreId(null);
        setStoreName(null);
      }
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setStoreId(null);
    setStoreName(null);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [items]
  );

  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const value = useMemo(
    () => ({
      items,
      storeId,
      storeName,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      deliveryFee,
      total,
    }),
    [items, storeId, storeName, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, deliveryFee, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
