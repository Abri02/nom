import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../api/orderApi";
import type { OrderStatusRequest } from "../types/order.types";

export function useCustomerOrder() {
  return useQuery({
    queryKey: ["customer-order"],
    queryFn: () => orderApi.getCustomerOrder(),
    refetchInterval: 30000,
    retry: false,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
    refetchInterval: 30000,
  });
}

export function useTrackOrder(orderId: string) {
  return useQuery({
    queryKey: ["order-tracking", orderId],
    queryFn: () => orderApi.trackOrder(orderId),
    enabled: !!orderId,
    refetchInterval: 10000,
  });
}

export function useRestaurantOrders(orderStatus: OrderStatusRequest) {
  return useQuery({
    queryKey: ["restaurant-orders", orderStatus.orderStatus],
    queryFn: () => orderApi.getOrdersForRestaurantByStatus(orderStatus),
    refetchInterval: 20000,
  });
}

export function useRestaurantNewOrders() {
  return useRestaurantOrders({ orderStatus: "NEW" });
}

export function useRestaurantPreparingOrders() {
  return useRestaurantOrders({ orderStatus: "PREPARING" });
}

export function useRestaurantReadyOrders() {
  return useRestaurantOrders({ orderStatus: "READY" });
}

export function useCourierOrders() {
  return useQuery({
    queryKey: ["courier-orders"],
    queryFn: () => orderApi.getOrdersForCourier(),
    refetchInterval: 20000,
  });
}
