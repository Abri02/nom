import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "./cartApi";
import type { AddItemRequest } from "../types/cart.types";

export const CART_QUERY_KEY = ["cart"];

export const useGetCart = () => {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useAddItemToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: AddItemRequest) => cartApi.addItemToCart(item),
    onSuccess: (data) => {
      console.log("Item added to cart successfully:", data);
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
    onError: (error) => {
      console.error("Failed to add item to cart:", error);
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: AddItemRequest[]) => cartApi.updateCart(items),
    onSuccess: (data) => {
      console.log("Cart synced to backend successfully:", data);
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
    onError: (error) => {
      console.error("Failed to sync cart to backend:", error);
    },
  });
};

export const useRemoveItemFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuItemId: string) => cartApi.removeItem(menuItemId),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};
