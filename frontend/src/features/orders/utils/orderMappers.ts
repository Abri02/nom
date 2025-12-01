import type { OrderDetail, Order, Location } from "../types/order.types";

export const mapOrderDetailToOrder = (orderDetail: OrderDetail): Order => {
  // currentLocation represents the restaurant's location
  const restaurantLocation: Location | undefined = orderDetail.currentLocation
    ? {
        latitude: orderDetail.currentLocation.latitude,
        longitude: orderDetail.currentLocation.longitude,
        address: orderDetail.restaurantName,
      }
    : undefined;

  const deliveryAddressString = orderDetail.deliveryAddress
    ? `${orderDetail.deliveryAddress.street} ${orderDetail.deliveryAddress.houseNumber}, ${orderDetail.deliveryAddress.city}`
    : "";

  const deliveryLocation: Location | undefined = orderDetail.deliveryAddress
    ?.coordinates
    ? {
        latitude: orderDetail.deliveryAddress.coordinates.latitude,
        longitude: orderDetail.deliveryAddress.coordinates.longitude,
        address: deliveryAddressString,
      }
    : undefined;

  const items = orderDetail.items.map((item) => ({
    menuItemId: item.menuItemId,
    menuItemName: item.menuItemName,
    quantity: item.quantity,
    price: item.price,
  }));

  return {
    id: orderDetail.id,
    userId: orderDetail.customerId,
    restaurantId: orderDetail.restaurantId,
    restaurantName: orderDetail.restaurantName,
    restaurantLocation,
    items,
    totalPrice: orderDetail.totalPrice,
    status: orderDetail.status,
    deliveryAddress: deliveryAddressString,
    deliveryLocation,
    courierLocation: undefined, // Real-time courier tracking not available in this field
    courierId: orderDetail.courierId,
    courierName: undefined,
    createdAt: orderDetail.createdAt,
    updatedAt: orderDetail.createdAt,
  };
};

export const mapOrderDetailsToOrders = (
  orderDetails: OrderDetail[]
): Order[] => {
  return orderDetails.map(mapOrderDetailToOrder);
};
