import type { MenuItem } from '../../restaurants/types/restaurant.types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantName: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, restaurantName: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}
