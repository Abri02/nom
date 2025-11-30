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
import type { OrderDetail, OrderStatus } from "../types/order.types";
import { OrderTrackingMap } from "./OrderTrackingMap";
import { yellow, purple, pink } from "../../common/theme/colorScheme";

interface CourierDeliveryCardProps {
  order: OrderDetail;
  onPickup?: (orderId: string) => void;
  onDeliver?: (orderId: string) => void;
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

export const CourierDeliveryCard = ({
  order,
  onPickup,
  onDeliver,
}: CourierDeliveryCardProps) => {
  const [showMap, setShowMap] = useState(false);

  const isReady = order.status === "READY";
  const isOnDelivery = order.status === "ON_DELIVERY";

  return (
    <Card.Root width="100%" boxShadow="md">
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between">
            <Box>
              <Heading size="md" color={"black"}>
                {order.restaurantName}
              </Heading>
              <Text fontSize="sm" color={yellow} mt={1} fontWeight="medium">
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
              <MapPin size={16} color={yellow} />
              <Text fontSize="sm" fontWeight="semibold" color={yellow}>
                Pick up from:
              </Text>
            </HStack>
            <Text fontWeight="medium" ml={6} color="black">
              {order.restaurantLocation?.address || "Restaurant address"}
            </Text>
          </Box>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <Box>
              <HStack gap={2} mb={1}>
                <MapPin size={16} color={yellow} />
                <Text fontSize="sm" fontWeight="semibold" color={yellow}>
                  Deliver to:
                </Text>
              </HStack>
              <Text fontWeight="medium" ml={6} color="white">
                {order.deliveryAddress.street}{" "}
                {order.deliveryAddress.houseNumber},{" "}
                {order.deliveryAddress.city} {order.deliveryAddress.postalCode}
              </Text>
            </Box>
          )}

          <Separator />

          {/* Order Items Summary */}
          <Box>
            <Text fontSize="sm" color={purple} mb={1} fontWeight="semibold">
              Items: {order.items.length} item(s)
            </Text>
            <Text fontWeight="bold" fontSize="lg" color={"black"}>
              Total: {order.totalPrice.toLocaleString()} HUF
            </Text>
          </Box>

          {/* Action Buttons */}
          <HStack gap={2}>
            <Button
              onClick={() => setShowMap(!showMap)}
              size="sm"
              bg={yellow}
              color="black"
              _hover={{ opacity: 0.8 }}
              variant="outline"
              borderColor={yellow}
              flex={1}
            >
              {showMap ? "Hide Map" : "View Map"}
            </Button>

            {isReady && onPickup && (
              <Button
                onClick={() => onPickup(order.id)}
                size="sm"
                bg={purple}
                color="black"
                _hover={{ bg: pink }}
                flex={1}
              >
                Pick Up Order
              </Button>
            )}

            {isOnDelivery && onDeliver && (
              <Button
                onClick={() => onDeliver(order.id)}
                size="sm"
                bg={purple}
                color="black"
                _hover={{ bg: pink }}
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
