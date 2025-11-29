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
import { MapPin } from "lucide-react";
import type { Order, OrderStatus } from "../types/order.types";
import { OrderTrackingMap } from "./OrderTrackingMap";

interface CourierDeliveryCardProps {
  order: Order;
  onPickup?: (orderId: string) => void;
  onDeliver?: (orderId: string) => void;
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

export const CourierDeliveryCard = ({
  order,
  onPickup,
  onDeliver,
}: CourierDeliveryCardProps) => {
  const [showMap, setShowMap] = useState(false);

  const isReady = order.status === "READY";
  const isOutForDelivery = order.status === "OUT_FOR_DELIVERY";

  return (
    <Card.Root width="100%" boxShadow="md">
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between">
            <Box>
              <Heading size="md">{order.restaurantName}</Heading>
              <Text fontSize="sm" color="gray.600" mt={1}>
                Order #{order.id.slice(0, 8)}
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

          {/* Restaurant Address */}
          <Box>
            <HStack gap={2} mb={1}>
              <MapPin size={16} color="#6B46C1" />
              <Text fontSize="sm" fontWeight="semibold" color="purple.600">
                Pick up from:
              </Text>
            </HStack>
            <Text fontWeight="medium" ml={6}>
              {order.restaurantLocation?.address || "Restaurant address"}
            </Text>
          </Box>

          {/* Delivery Address */}
          <Box>
            <HStack gap={2} mb={1}>
              <MapPin size={16} color="#00718F" />
              <Text fontSize="sm" fontWeight="semibold" color="cyan.600">
                Deliver to:
              </Text>
            </HStack>
            <Text fontWeight="medium" ml={6}>
              {order.deliveryAddress}
            </Text>
          </Box>

          <Separator />

          {/* Order Items Summary */}
          <Box>
            <Text fontSize="sm" color="gray.600" mb={1}>
              Items: {order.items.length} item(s)
            </Text>
            <Text fontWeight="bold" fontSize="lg" color="purple.600">
              Total: {order.totalPrice.toLocaleString()} HUF
            </Text>
          </Box>

          {/* Action Buttons */}
          <HStack gap={2}>
            <Button
              onClick={() => setShowMap(!showMap)}
              size="sm"
              colorScheme="purple"
              variant="outline"
              flex={1}
            >
              {showMap ? "Hide Map" : "View Map"}
            </Button>

            {isReady && onPickup && (
              <Button
                onClick={() => onPickup(order.id)}
                size="sm"
                colorScheme="purple"
                flex={1}
              >
                Pick Up Order
              </Button>
            )}

            {isOutForDelivery && onDeliver && (
              <Button
                onClick={() => onDeliver(order.id)}
                size="sm"
                colorScheme="green"
                flex={1}
              >
                Mark as Delivered
              </Button>
            )}
          </HStack>

          {/* Map */}
          {showMap && (
            <Box mt={2}>
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
