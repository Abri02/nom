import type { OrderDetail } from "../../orders/types/order.types";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  city: string;
  street: string;
  streetNumber: string;
  role: "CUSTOMER" | "RESTAURANT" | "COURIER" | "ADMIN" | "UNKNOWN";
  description?: string;
  isSuspended: boolean;
  favouriteRestaurants: string[];
  createdAt: string;
}

export interface UpdateOrderRequest {
  order: OrderDetail;
}

export interface CancelOrderRequest {
  orderId: string;
}
