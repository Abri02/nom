import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { CartItem, CartContextType } from "../types/cart.types";
import type { MenuItem } from "../../restaurants/types/restaurant.types";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  readonly children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (menuItem: MenuItem, restaurantName: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { menuItem, quantity: 1, restaurantName }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.menuItem.id !== menuItemId)
    );
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalPrice,
      totalItems,
    }),
    [items, totalPrice, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
