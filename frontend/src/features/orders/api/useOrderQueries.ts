import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "./orderApi";
import type { OrderStatus } from "../types/order.types";

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
    queryFn: async () => {
      const order = await orderApi.getCustomerOrder();
      return order ? [order] : [];
    },
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
    queryFn: () => orderApi.trackOrder(orderId),
    enabled,
    refetchInterval: 5000, // Poll every 5 seconds for live tracking
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderApi.placeOrder(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.list() });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.declineOrder({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

// Restaurant-specific hooks
export const useRestaurantOrders = (status: OrderStatus) => {
  return useQuery({
    queryKey: [...orderQueryKeys.all, "restaurant", status],
    queryFn: () =>
      orderApi.getOrdersForRestaurantByStatus({ orderStatus: status }),
    enabled: !!status,
  });
};

export const useAllRestaurantOrders = () => {
  return useQuery({
    queryKey: [...orderQueryKeys.all, "restaurant", "all"],
    queryFn: async () => {
      // Fetch orders for all relevant statuses and combine them
      const statuses: OrderStatus[] = [
        "NEW",
        "PREPARING",
        "READY",
        "ON_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ];
      const allOrders = await Promise.all(
        statuses.map((status) =>
          orderApi.getOrdersForRestaurantByStatus({ orderStatus: status })
        )
      );
      return allOrders.flat();
    },
  });
};

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.acceptOrder({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

export const useDeclineOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.declineOrder({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

export const useMarkOrderReady = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.prepareOrder({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

// Courier-specific hooks
export const useCourierDeliveries = () => {
  return useQuery({
    queryKey: [...orderQueryKeys.all, "courier"],
    queryFn: () => orderApi.getOrdersForCourier(),
  });
};

export const usePickupOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.startDelivery({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

export const useDeliverOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.finishDelivery({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};
