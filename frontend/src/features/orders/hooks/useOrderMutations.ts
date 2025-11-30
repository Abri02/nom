import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/orderApi";
import type { OrderIdRequest, OrderDetail } from "../types/order.types";
import { toaster } from "../../../components/ui/toaster";

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderApi.placeOrder(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer-order"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toaster.create({
        title: "Order placed successfully!",
        description: `Your order #${data.id} has been placed.`,
        type: "success",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "Failed to place order",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    },
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: OrderIdRequest) => orderApi.acceptOrder(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });

      toaster.create({
        title: "Order accepted",
        description: "Order is now being prepared.",
        type: "success",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "Failed to accept order",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    },
  });
}

export function useDeclineOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: OrderIdRequest) => orderApi.declineOrder(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });

      toaster.create({
        title: "Order declined",
        description: "The order has been cancelled.",
        type: "info",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "Failed to decline order",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    },
  });
}

export function usePrepareOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: OrderIdRequest) => orderApi.prepareOrder(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });

      toaster.create({
        title: "Order is being prepared",
        type: "success",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "Failed to update order",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    },
  });
}

export function useStartDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: OrderIdRequest) => orderApi.startDelivery(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
      queryClient.invalidateQueries({ queryKey: ["courier-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });

      toaster.create({
        title: "Delivery started",
        description: "Order is now out for delivery.",
        type: "success",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "Failed to start delivery",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    },
  });
}

export function useFinishDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: OrderIdRequest) => orderApi.finishDelivery(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courier-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
      queryClient.invalidateQueries({ queryKey: ["customer-order"] });

      toaster.create({
        title: "Order delivered!",
        description: "The order has been successfully delivered.",
        type: "success",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "Failed to mark as delivered",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    },
  });
}
