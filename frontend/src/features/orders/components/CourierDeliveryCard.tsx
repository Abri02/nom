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
import { yellow, purple, pink } from "../../common/theme/colorScheme";
import { NomButtons } from "../../common/components/NomButton";

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
    NEW: { bg: "#BEE3F8", color: "#2C5282" }, // Blue
    PREPARING: { bg: "#FED7AA", color: "#C05621" }, // Orange
    READY: { bg: "#D6BCFA", color: "#6B46C1" }, // Purple
    ON_DELIVERY: { bg: "#B2F5EA", color: "#00718F" }, // Cyan
    DELIVERED: { bg: "#C6F6D5", color: "#276749" }, // Green
    CANCELLED: { bg: "#FED7D7", color: "#C53030" }, // Red
  };
  return styles[status] || { bg: "#E2E8F0", color: "#2D3748" }; // Gray fallback
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
    <Card.Root width="100%" boxShadow="md" bgColor={purple}>
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between">
            <Box>
              <Heading size="lg" color={yellow}>
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

          <Box>
            <HStack gap={2} mb={1}>
              <MapPin size={16} color={yellow} />
              <Text fontSize="sm" fontWeight="semibold" color={yellow}>
                Pick up from:
              </Text>
            </HStack>
            <Text fontWeight="medium" ml={6} color={yellow}>
              {order.restaurantLocation?.address || "Restaurant address"}
            </Text>
          </Box>

          {order.deliveryAddress && (
            <Box>
              <HStack gap={2} mb={1}>
                <MapPin size={16} color={yellow} />
                <Text fontSize="sm" fontWeight="semibold" color={yellow}>
                  Deliver to:
                </Text>
              </HStack>
              <Text fontWeight="medium" ml={6} color="white">
                {order.deliveryAddress}
              </Text>
            </Box>
          )}

          <Separator />

          <Box>
            <Text fontSize="sm" color={yellow} mb={1} fontWeight="semibold">
              Items: {order.items.length} item(s)
            </Text>
            <Text fontWeight="bold" fontSize="lg" color={yellow}>
              Total: {order.totalPrice.toLocaleString()} HUF
            </Text>
          </Box>

          <HStack gap={2}>
            <NomButtons
              onClick={() => setShowMap(!showMap)}
              size="sm"
              flex={1}
              title={showMap ? "Hide Map" : "View Map"}
            ></NomButtons>

            {isReady && onPickup && (
              <NomButtons
                onClick={() => onPickup(order.id)}
                size="sm"
                bg={purple}
                color="white"
                _hover={{ bg: pink }}
                flex={1}
                title="Pick Up Order"
              ></NomButtons>
            )}

            {isOnDelivery && onDeliver && (
              <NomButtons
                onClick={() => onDeliver(order.id)}
                size="sm"
                colorScheme="outline"
                flex={1}
                title="Mark as Delivered"
              ></NomButtons>
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
