import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./adminApi";
import type { OrderDetail } from "../../orders/types/order.types";
import type { User } from "../types/admin.types";

export const adminQueryKeys = {
  all: ["admin"] as const,
  users: () => [...adminQueryKeys.all, "users"] as const,
  orders: () => [...adminQueryKeys.all, "orders"] as const,
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: () => adminApi.getAllUsers(),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: Partial<User> & { id: string }) => adminApi.updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
    },
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: adminQueryKeys.orders(),
    queryFn: () => adminApi.getAllOrders(),
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order: OrderDetail) => adminApi.updateOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders() });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => adminApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders() });
    },
  });
};
