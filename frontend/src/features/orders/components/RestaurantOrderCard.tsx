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
import type { Order, OrderStatus } from "../types/order.types";

interface RestaurantOrderCardProps {
  order: Order;
  onAccept?: (orderId: string) => void;
  onDecline?: (orderId: string) => void;
  onMarkReady?: (orderId: string) => void;
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

export const RestaurantOrderCard = ({
  order,
  onAccept,
  onDecline,
  onMarkReady,
}: RestaurantOrderCardProps) => {
  const isPending = order.status === "PENDING";
  const isConfirmed = order.status === "CONFIRMED";
  const isPreparing = order.status === "PREPARING";

  return (
    <Card.Root width="100%" boxShadow="md">
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between">
            <Box>
              <Heading size="md">Order #{order.id.slice(0, 8)}</Heading>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </Box>
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

          <Separator />

          <Box>
            <Text fontSize="sm" color="gray.600" mb={1}>
              Delivery Address:
            </Text>
            <Text fontWeight="medium">{order.deliveryAddress}</Text>
          </Box>

          <Separator />

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.700">
              Items:
            </Text>
            {order.items.map((item, index) => (
              <HStack key={index} justify="space-between">
                <Text>
                  {item.quantity}x {item.menuItemName}
                </Text>
                <Text fontWeight="medium">
                  {(item.price * item.quantity).toLocaleString()} HUF
                </Text>
              </HStack>
            ))}
          </VStack>

          <Separator />

          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="lg">
              Total
            </Text>
            <Text fontWeight="bold" fontSize="xl" color="purple.600">
              {order.totalPrice.toLocaleString()} HUF
            </Text>
          </HStack>

          {/* Action Buttons */}
          {isPending && (
            <HStack gap={2} mt={2}>
              <Button
                onClick={() => onAccept?.(order.id)}
                size="md"
                colorScheme="green"
                flex={1}
              >
                Accept Order
              </Button>
              <Button
                onClick={() => onDecline?.(order.id)}
                size="md"
                colorScheme="red"
                variant="outline"
                flex={1}
              >
                Decline
              </Button>
            </HStack>
          )}

          {(isConfirmed || isPreparing) && (
            <Button
              onClick={() => onMarkReady?.(order.id)}
              size="md"
              colorScheme="purple"
              width="100%"
              mt={2}
            >
              Mark as Out for Delivery
            </Button>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
