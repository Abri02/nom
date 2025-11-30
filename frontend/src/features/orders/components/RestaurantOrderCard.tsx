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
import type { OrderDetail, OrderStatus } from "../types/order.types";
import { yellow, purple, pink } from "../../common/theme/colorScheme";

interface RestaurantOrderCardProps {
  order: OrderDetail;
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

export const RestaurantOrderCard = ({
  order,
  onAccept,
  onDecline,
  onMarkReady,
}: RestaurantOrderCardProps) => {
  const isNew = order.status === "NEW";
  const isPreparing = order.status === "PREPARING";
  const isReady = order.status === "READY";

  return (
    <Card.Root width="100%" boxShadow="md">
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between">
            <Box>
              <Heading size="md" color={"black"}>
                Order #{order.id.slice(0, 8)}
              </Heading>
              <Text fontSize="sm" color={purple} mt={1} fontWeight="medium">
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

          {order.deliveryAddress && (
            <>
              <Box>
                <Text fontSize="sm" color={yellow} mb={1} fontWeight="semibold">
                  Delivery Address:
                </Text>
                <Text fontWeight="medium" color="black">
                  {order.deliveryAddress.street}{" "}
                  {order.deliveryAddress.houseNumber},{" "}
                  {order.deliveryAddress.city}{" "}
                  {order.deliveryAddress.postalCode}
                </Text>
              </Box>
              <Separator />
            </>
          )}

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color={"black"}>
              Items: {order.items.length} item(s)
            </Text>
            {order.items.map((item, index) => (
              <HStack key={index} justify="space-between">
                <Text color="black">
                  {item.quantity}x Menu Item (ID: {item.menuItemId.slice(0, 8)})
                </Text>
              </HStack>
            ))}
          </VStack>

          <Separator />

          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="lg" color={purple}>
              Total
            </Text>
            <Text fontWeight="bold" fontSize="xl" color={yellow}>
              {order.totalPrice.toLocaleString()} HUF
            </Text>
          </HStack>

          {/* Action Buttons */}
          {isNew && (
            <HStack gap={2} mt={2}>
              <Button
                onClick={() => onAccept?.(order.id)}
                size="md"
                bg={purple}
                color="white"
                _hover={{ bg: pink }}
                flex={1}
              >
                Accept Order
              </Button>
              <Button
                onClick={() => onDecline?.(order.id)}
                size="md"
                bg={yellow}
                color="black"
                _hover={{ opacity: 0.8 }}
                variant="outline"
                borderColor={yellow}
                flex={1}
              >
                Decline
              </Button>
            </HStack>
          )}

          {(isPreparing || isReady) && (
            <Button
              onClick={() => onMarkReady?.(order.id)}
              size="md"
              bg={purple}
              color="white"
              _hover={{ bg: pink }}
              width="100%"
              mt={2}
            >
              Mark as Ready for Pickup
            </Button>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
