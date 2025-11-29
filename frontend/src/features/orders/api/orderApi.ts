import { apiClient } from "../../../lib/apiClient";
import type {
  CreateOrderRequest,
  Order,
  OrderTrackingInfo,
} from "../types/order.types";
import { mockOrders } from "../data/mockOrders";

// Toggle this to switch between mock data and real API
const USE_MOCK_DATA = true;

export const orderApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error("Mock data: Creating orders not supported in demo mode");
    }
    const response = await apiClient.post<Order>("/api/orders", data);
    return response.data;
  },

  getUserOrders: async (): Promise<Order[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockOrders;
    }
    const response = await apiClient.get<Order[]>("/api/orders");
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const order = mockOrders.find((o) => o.id === orderId);
      if (!order) throw new Error("Order not found");
      return order;
    }
    const response = await apiClient.get<Order>(`/api/orders/${orderId}`);
    return response.data;
  },

  getOrderTracking: async (orderId: string): Promise<OrderTrackingInfo> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const order = mockOrders.find((o) => o.id === orderId);
      if (!order) throw new Error("Order not found");

      // Simulate moving courier
      const tracking: OrderTrackingInfo = {
        orderId: order.id,
        status: order.status,
        restaurantLocation: order.restaurantLocation,
        deliveryLocation: order.deliveryLocation,
        courierLocation: order.courierLocation
          ? {
              ...order.courierLocation,
              // Add small random movement to simulate courier moving
              latitude:
                order.courierLocation.latitude + (Math.random() - 0.5) * 0.001,
              longitude:
                order.courierLocation.longitude + (Math.random() - 0.5) * 0.001,
            }
          : undefined,
      };
      return tracking;
    }
    const response = await apiClient.get<OrderTrackingInfo>(
      `/api/orders/${orderId}/tracking`
    );
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const orderIndex = mockOrders.findIndex((o) => o.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = "CANCELLED";
      }
      return;
    }
    await apiClient.put(`/api/orders/${orderId}/cancel`);
  },

  // Restaurant-specific endpoints
  getRestaurantOrders: async (restaurantId: string): Promise<Order[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockOrders.filter((o) => o.restaurantId !== restaurantId);
    }
    const response = await apiClient.get<Order[]>(
      `/api/restaurants/${restaurantId}/orders`
    );
    return response.data;
  },

  acceptOrder: async (orderId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const orderIndex = mockOrders.findIndex((o) => o.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = "CONFIRMED";
      }
      return;
    }
    await apiClient.put(`/api/orders/${orderId}/accept`);
  },

  declineOrder: async (orderId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const orderIndex = mockOrders.findIndex((o) => o.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = "CANCELLED";
      }
      return;
    }
    await apiClient.put(`/api/orders/${orderId}/decline`);
  },

  markOrderReady: async (orderId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const orderIndex = mockOrders.findIndex((o) => o.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = "OUT_FOR_DELIVERY";
      }
      return;
    }
    await apiClient.put(`/api/orders/${orderId}/ready`);
  },
};
