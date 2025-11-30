import { apiClient } from "../../../lib/apiClient";
import type { OrderDetail } from "../../orders/types/order.types";
import type { User } from "../types/admin.types";

export const adminApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/api/admin/users");
    return response.data;
  },

  updateUser: async (user: Partial<User> & { id: string }): Promise<User> => {
    const response = await apiClient.post<User>("/api/users", user);
    return response.data;
  },

  getAllOrders: async (): Promise<OrderDetail[]> => {
    const response = await apiClient.get<OrderDetail[]>("/api/admin/orders");
    return response.data;
  },

  updateOrder: async (order: OrderDetail): Promise<OrderDetail> => {
    const response = await apiClient.put<OrderDetail>("/api/admin/orders", order);
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    await apiClient.delete("/api/admin/orders", {
      params: { orderId },
    });
  },
};
