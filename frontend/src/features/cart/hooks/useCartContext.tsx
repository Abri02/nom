import { createContext, useContext, useMemo, useCallback, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CartItem, CartContextType, AddItemRequest } from "../types/cart.types";
import type { MenuItem } from "../../restaurants/types/restaurant.types";
import {
  useGetCart,
  useUpdateCart,
} from "../api/useCartQueries";
import { useAuth } from "../../auth/hooks/useAuthContext";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  readonly children: ReactNode;
}

interface LocalCartItem {
  restaurantId: string;
  menuItem: MenuItem;
  quantity: number;
  restaurantName: string;
}

export function CartProvider({ children }: CartProviderProps) {
  const { isLoggedIn } = useAuth();
  const { data: backendCart, isLoading: isLoadingCart, error } = useGetCart(isLoggedIn);
  const updateCartMutation = useUpdateCart();

  const [localCartItems, setLocalCartItems] = useState<LocalCartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  if (error) {
    console.error("Cart API error:", error);
  }

  useEffect(() => {
    if (backendCart && !isInitialized) {
      console.log("Initializing cart from backend:", backendCart);
      const initialItems: LocalCartItem[] = backendCart.items.map((item) => ({
        restaurantId: item.restaurantId,
        menuItem: {
          id: item.menuItemId,
          name: item.name,
          price: item.price,
          allergens: [],
          imageUrl: item.imageUrl,
        },
        quantity: item.quantity,
        restaurantName: "",
      }));
      setLocalCartItems(initialItems);
      setIsInitialized(true);
    }
  }, [backendCart, isInitialized]);

  const syncToBackend = useCallback((items: LocalCartItem[]) => {
    if (!isInitialized) return;

    const backendItems: AddItemRequest[] = items.map((item) => ({
      restaurantId: item.restaurantId,
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
    }));

    console.log("Syncing cart to backend:", backendItems);
    updateCartMutation.mutate(backendItems);
  }, [updateCartMutation, isInitialized]);

  const addItem = useCallback(
    (menuItem: MenuItem, restaurantName: string, restaurantId: string) => {
      setLocalCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.menuItem.id === menuItem.id
        );

        let newItems: LocalCartItem[];
        if (existingItem) {
          newItems = prevItems.map((item) =>
            item.menuItem.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [
            ...prevItems,
            { menuItem, quantity: 1, restaurantName, restaurantId },
          ];
        }

        syncToBackend(newItems);
        return newItems;
      });
    },
    [syncToBackend]
  );

  const removeItem = useCallback(
    (menuItemId: string) => {
      setLocalCartItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.menuItem.id !== menuItemId);
        syncToBackend(newItems);
        return newItems;
      });
    },
    [syncToBackend]
  );

  const updateQuantity = useCallback(
    (menuItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(menuItemId);
        return;
      }

      setLocalCartItems((prevItems) => {
        const newItems = prevItems.map((item) =>
          item.menuItem.id === menuItemId ? { ...item, quantity } : item
        );
        syncToBackend(newItems);
        return newItems;
      });
    },
    [removeItem, syncToBackend]
  );

  const clearCart = useCallback(() => {
    setLocalCartItems([]);
    syncToBackend([]);
  }, [syncToBackend]);

  const items: CartItem[] = useMemo(() => {
    return localCartItems.map((item) => ({
      menuItem: item.menuItem,
      quantity: item.quantity,
      restaurantName: item.restaurantName,
      lineTotal: item.menuItem.price * item.quantity,
    }));
  }, [localCartItems]);

  const totalPrice = useMemo(
    () => localCartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [localCartItems]
  );

  const totalItems = useMemo(
    () => localCartItems.reduce((sum, item) => sum + item.quantity, 0),
    [localCartItems]
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
      isLoading: isLoadingCart && !isInitialized,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalItems, isLoadingCart, isInitialized]
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
