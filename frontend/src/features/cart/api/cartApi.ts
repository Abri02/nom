import { apiClient } from "../../../lib/apiClient";
import type { AddItemRequest, CartDetails } from "../types/cart.types";

const CART_BASE_URL = "/api/cart";

export const cartApi = {
  /**
   * Get the current user's cart
   */
  getCart: async (): Promise<CartDetails> => {
    console.log("[Cart API] getCart called");
    console.log("[Cart API] Token in localStorage before request:", localStorage.getItem("authToken") ? "EXISTS" : "MISSING");
    const response = await apiClient.get<CartDetails>(CART_BASE_URL);
    return response.data;
  },

  /**
   * Add a single item to the cart
   */
  addItemToCart: async (item: AddItemRequest): Promise<CartDetails> => {
    const response = await apiClient.post<CartDetails>(
      `${CART_BASE_URL}/items`,
      item
    );
    return response.data;
  },

  /**
   * Update the entire cart with multiple items
   * This replaces the current cart contents
   */
  updateCart: async (items: AddItemRequest[]): Promise<CartDetails> => {
    const response = await apiClient.put<CartDetails>(
      `${CART_BASE_URL}/items`,
      items
    );
    return response.data;
  },

  /**
   * Remove a specific item from the cart
   */
  removeItem: async (menuItemId: string): Promise<CartDetails> => {
    const response = await apiClient.delete<CartDetails>(
      `${CART_BASE_URL}/items/${menuItemId}`
    );
    return response.data;
  },

  /**
   * Clear all items from the cart
   */
  clearCart: async (): Promise<CartDetails> => {
    const response = await apiClient.delete<CartDetails>(CART_BASE_URL);
    return response.data;
  },
};
