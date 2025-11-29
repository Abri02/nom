export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLocation?: Location;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryLocation?: Location;
  courierLocation?: Location;
  courierId?: string;
  courierName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  deliveryAddress: string;
  deliveryLocation?: Location;
}

export interface OrderTrackingInfo {
  orderId: string;
  status: OrderStatus;
  restaurantLocation?: Location;
  deliveryLocation?: Location;
  courierLocation?: Location;
  estimatedDeliveryTime?: string;
}
