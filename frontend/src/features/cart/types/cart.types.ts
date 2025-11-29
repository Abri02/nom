import type { MenuItem } from '../../restaurants/types/restaurant.types';

export interface AddItemRequest {
  restaurantId: string;
  menuItemId: string;
  quantity: number;
}

export interface CartItemDetails {
  restaurantId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface CartDetails {
  customerId: string;
  restaurantId?: string;
  items: CartItemDetails[];
  totalPrice: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantName: string;
  lineTotal: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, restaurantName: string, restaurantId: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isLoading: boolean;
}
