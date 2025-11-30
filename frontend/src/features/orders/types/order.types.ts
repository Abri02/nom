export type OrderStatus =
  | "NEW"
  | "PREPARING"
  | "READY"
  | "ON_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "CREDIT_CARD" | "SZEP_CARD" | "CASH_ON_DELIVERY";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Address {
  houseNumber: number;
  street: string;
  city: string;
  postalCode: string;
  coordinates?: GeoPoint;
}

export interface CartItem {
  restaurantId: string;
  menuItemId: string;
  quantity: number;
}

export interface OrderDetail {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  courierId?: string;
  items: CartItem[];
  deliveryAddress?: Address;
  currentLocation?: GeoPoint;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderIdRequest {
  orderId: string;
}

export interface OrderStatusRequest {
  orderStatus: OrderStatus;
}

export interface CourierPosition {
  id?: string;
  courierId: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}
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
