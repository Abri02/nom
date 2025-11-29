import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Separator,
} from "@chakra-ui/react";
import { useState } from "react";
import type { Order, OrderStatus } from "../types/order.types";
import { OrderTrackingMap } from "./OrderTrackingMap";

interface OrderCardProps {
  order: Order;
  onCancelOrder?: (orderId: string) => void;
}

interface StatusStyle {
  bg: string;
  color: string;
}

const getStatusStyle = (status: OrderStatus): StatusStyle => {
  const styles: Record<OrderStatus, StatusStyle> = {
    PENDING: { bg: "#E2E8F0", color: "#2D3748" }, // Gray
    CONFIRMED: { bg: "#BEE3F8", color: "#2C5282" }, // Blue
    PREPARING: { bg: "#FED7AA", color: "#C05621" }, // Orange
    READY: { bg: "#D6BCFA", color: "#6B46C1" }, // Purple
    OUT_FOR_DELIVERY: { bg: "#B2F5EA", color: "#00718F" }, // Cyan
    DELIVERED: { bg: "#C6F6D5", color: "#276749" }, // Green
    CANCELLED: { bg: "#FED7D7", color: "#C53030" }, // Red
  };
  return styles[status];
};

const formatStatus = (status: OrderStatus): string => {
  return status.replace(/_/g, " ");
};

export const OrderCard = ({ order, onCancelOrder }: OrderCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const canCancel = ["PENDING", "CONFIRMED"].includes(order.status);
  const showTracking = ["PREPARING", "READY", "OUT_FOR_DELIVERY"].includes(order.status);

  return (
    <Card.Root width="100%" boxShadow="md">
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between">
            <Heading size="md">{order.restaurantName}</Heading>
            <Badge
              bg={getStatusStyle(order.status).bg}
              color={getStatusStyle(order.status).color}
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
              fontWeight="semibold"
            >
              {formatStatus(order.status)}
            </Badge>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Order #{order.id.slice(0, 8)}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </HStack>

          <Separator />

          <VStack align="stretch" gap={2}>
            {order.items.map((item, index) => (
              <HStack key={index} justify="space-between">
                <Text>
                  {item.quantity}x {item.menuItemName}
                </Text>
                <Text fontWeight="medium">{(item.price * item.quantity).toLocaleString()} HUF</Text>
              </HStack>
            ))}
          </VStack>

          <Separator />

          <HStack justify="space-between">
            <Text fontWeight="bold">Total</Text>
            <Text fontWeight="bold" fontSize="lg">
              {order.totalPrice.toLocaleString()} HUF
            </Text>
          </HStack>

          {order.deliveryAddress && (
            <Box>
              <Text fontSize="sm" color="gray.600">
                Delivery to:
              </Text>
              <Text fontWeight="medium">{order.deliveryAddress}</Text>
            </Box>
          )}

          {order.courierName && (
            <Box>
              <Text fontSize="sm" color="gray.600">
                Courier: <Text as="span" fontWeight="medium">{order.courierName}</Text>
              </Text>
            </Box>
          )}

          <HStack gap={2}>
            {showTracking && (
              <Button onClick={() => setIsOpen(!isOpen)} size="sm" colorScheme="purple" flex={1}>
                {isOpen ? "Hide Map" : "Track Order"}
              </Button>
            )}
            {canCancel && onCancelOrder && (
              <Button
                onClick={() => onCancelOrder(order.id)}
                size="sm"
                colorScheme="red"
                variant="outline"
                flex={1}
              >
                Cancel Order
              </Button>
            )}
          </HStack>

          {showTracking && isOpen && (
            <Box mt={4}>
              <OrderTrackingMap
                restaurantLocation={order.restaurantLocation}
                deliveryLocation={order.deliveryLocation}
                courierLocation={order.courierLocation}
                restaurantName={order.restaurantName}
              />
            </Box>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
