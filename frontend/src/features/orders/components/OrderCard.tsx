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
import { yellow, purple } from "../../common/theme/colorScheme";

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
    NEW: { bg: "#BEE3F8", color: "#2C5282" }, // Blue
    PREPARING: { bg: "#FED7AA", color: "#C05621" }, // Orange
    READY: { bg: "#D6BCFA", color: "#6B46C1" }, // Purple
    ON_DELIVERY: { bg: "#B2F5EA", color: "#00718F" }, // Cyan
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

  const canCancel = ["NEW"].includes(order.status);
  const showTracking = ["PREPARING", "READY", "ON_DELIVERY"].includes(
    order.status
  );

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
            <Text fontSize="sm" color={yellow} fontWeight="medium">
              Order #{order.id.slice(0, 8)}
            </Text>
            <Text fontSize="sm" color={yellow} fontWeight="medium">
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </HStack>

          <Separator />

          <VStack align="stretch" gap={2}>
            {order.items.map((item, index) => (
              <HStack key={index} justify="space-between">
                <Text color="black">
                  {item.quantity}x {item.menuItemName}
                </Text>
                <Text fontWeight="medium" color={yellow}>
                  {(item.price * item.quantity).toLocaleString()} HUF
                </Text>
              </HStack>
            ))}
          </VStack>

          <Separator />

          <HStack justify="space-between">
            <Text fontWeight="bold" color={yellow}>
              Total
            </Text>
            <Text fontWeight="bold" fontSize="lg" color={yellow}>
              {order.totalPrice.toLocaleString()} HUF
            </Text>
          </HStack>

          {order.deliveryAddress && (
            <Box>
              <Text fontSize="sm" color={yellow} fontWeight="semibold">
                Delivery to:
              </Text>
              <Text fontWeight="medium" color="white">
                {order.deliveryAddress}
              </Text>
            </Box>
          )}

          {order.courierName && (
            <Box>
              <Text fontSize="sm" color={yellow} fontWeight="semibold">
                Courier:{" "}
                <Text as="span" fontWeight="medium" color="white">
                  {order.courierName}
                </Text>
              </Text>
            </Box>
          )}

          <HStack gap={2}>
            {showTracking && (
              <Button
                onClick={() => setIsOpen(!isOpen)}
                size="sm"
                bg={purple}
                color="white"
                _hover={{ opacity: 0.8 }}
                flex={1}
              >
                {isOpen ? "Hide Map" : "Track Order"}
              </Button>
            )}
            {canCancel && onCancelOrder && (
              <Button
                onClick={() => onCancelOrder(order.id)}
                size="sm"
                bg={yellow}
                color="black"
                _hover={{ opacity: 0.8 }}
                variant="outline"
                borderColor={yellow}
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
