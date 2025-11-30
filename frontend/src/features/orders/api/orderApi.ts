import { apiClient } from "../../../lib/apiClient";
import type {
  OrderDetail,
  OrderIdRequest,
  OrderStatusRequest,
  CourierPosition,
} from "../types/order.types";

export const orderApi = {
  placeOrder: async (): Promise<OrderDetail> => {
    const response = await apiClient.post<OrderDetail>("/api/orders");
    return response.data;
  },

  getCustomerOrder: async (): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>("/api/orders/me");
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(`/api/orders/${orderId}`);
    return response.data;
  },

  getOrdersForRestaurantByStatus: async (
    orderStatus: OrderStatusRequest
  ): Promise<OrderDetail[]> => {
    const response = await apiClient.get<OrderDetail[]>("/api/orders/restaurant", {
      params: orderStatus,
    });
    return response.data;
  },

  acceptOrder: async (request: OrderIdRequest): Promise<OrderDetail> => {
    const response = await apiClient.post<OrderDetail>("/api/orders/accept", request);
    return response.data;
  },

  declineOrder: async (request: OrderIdRequest): Promise<OrderDetail> => {
    const response = await apiClient.post<OrderDetail>("/api/orders/decline", request);
    return response.data;
  },

  prepareOrder: async (request: OrderIdRequest): Promise<OrderDetail> => {
    const response = await apiClient.post<OrderDetail>("/api/orders/prepare", request);
    return response.data;
  },

  startDelivery: async (request: OrderIdRequest): Promise<OrderDetail> => {
    const response = await apiClient.post<OrderDetail>("/api/orders/start-delivery", request);
    return response.data;
  },

  getOrdersForCourier: async (): Promise<OrderDetail[]> => {
    const response = await apiClient.get<OrderDetail[]>("/api/orders/courier/me");
    return response.data;
  },

  finishDelivery: async (request: OrderIdRequest): Promise<OrderDetail> => {
    const response = await apiClient.post<OrderDetail>("/api/orders/finish-delivery", request);
    return response.data;
  },

  trackOrder: async (orderId: string): Promise<CourierPosition> => {
    const response = await apiClient.get<CourierPosition>(`/api/courier/track/${orderId}`);
    return response.data;
  },
};
