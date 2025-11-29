import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "./orderApi";
import type { CreateOrderRequest } from "../types/order.types";

export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: () => [...orderQueryKeys.lists()] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
  tracking: (id: string) => [...orderQueryKeys.all, "tracking", id] as const,
};

export const useUserOrders = () => {
  return useQuery({
    queryKey: orderQueryKeys.list(),
    queryFn: () => orderApi.getUserOrders(),
  });
};

export const useOrderDetails = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => orderApi.getOrderById(orderId),
    enabled,
  });
};

export const useOrderTracking = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: orderQueryKeys.tracking(orderId),
    queryFn: () => orderApi.getOrderTracking(orderId),
    enabled,
    refetchInterval: 5000, // Poll every 5 seconds for live tracking
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.list() });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

// Restaurant-specific hooks
export const useRestaurantOrders = (restaurantId: string) => {
  return useQuery({
    queryKey: [...orderQueryKeys.all, "restaurant", restaurantId],
    queryFn: () => orderApi.getRestaurantOrders(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

export const useDeclineOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.declineOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

export const useMarkOrderReady = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.markOrderReady(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};
