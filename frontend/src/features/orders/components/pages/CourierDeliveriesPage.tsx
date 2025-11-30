import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Spinner,
  Center,
  Tabs,
} from "@chakra-ui/react";
import { useCourierDeliveries, usePickupOrder, useDeliverOrder } from "../../api/useOrderQueries";
import { CourierDeliveryCard } from "../CourierDeliveryCard";
import type { OrderDetail } from "../../types/order.types";
import { purple, lightPurple } from "../../../common/theme/colorScheme";
import { useAuth } from "../../../auth/hooks/useAuthContext";

export const CourierDeliveriesPage = () => {
  const { user } = useAuth();

  const { data: deliveries, isLoading, error } = useCourierDeliveries();
  const pickupMutation = usePickupOrder();
  const deliverMutation = useDeliverOrder();

  const handlePickup = async (orderId: string) => {
    try {
      await pickupMutation.mutateAsync(orderId);
    } catch (error) {
      console.error("Failed to pick up order:", error);
    }
  };

  const handleDeliver = async (orderId: string) => {
    if (window.confirm("Confirm delivery completion?")) {
      try {
        await deliverMutation.mutateAsync(orderId);
      } catch (error) {
        console.error("Failed to mark order as delivered:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box
          bg="red.50"
          borderColor="red.200"
          borderWidth={1}
          borderRadius="md"
          p={4}
        >
          <Heading size="sm" color="red.800" mb={2}>
            Error loading deliveries
          </Heading>
          <Text color="red.700">
            {error instanceof Error
              ? error.message
              : "Failed to load deliveries. Please try again later."}
          </Text>
        </Box>
      </Container>
    );
  }

  // Filter orders to show only those assigned to this courier
  const courierOrders = deliveries?.filter((order) =>
    order.courierId === user?.id
  ) || [];

  const availableDeliveries = courierOrders.filter((order) => order.status === "READY");
  const activeDeliveries = courierOrders.filter((order) => order.status === "ON_DELIVERY");
  const completedDeliveries = courierOrders.filter((order) => order.status === "DELIVERED");

  const renderDeliveriesList = (deliveriesList: OrderDetail[], emptyMessage: string) => {
    if (deliveriesList.length === 0) {
      return (
        <Center py={12}>
          <VStack gap={2}>
            <Text fontSize="lg" color="gray.600">
              {emptyMessage}
            </Text>
          </VStack>
        </Center>
      );
    }

    return (
      <VStack gap={4} align="stretch">
        {deliveriesList.map((delivery) => (
          <CourierDeliveryCard
            key={delivery.id}
            order={delivery}
            onPickup={handlePickup}
            onDeliver={handleDeliver}
          />
        ))}
      </VStack>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Heading size="xl">My Deliveries</Heading>

        <Tabs.Root defaultValue="available" variant="enclosed">
          <Tabs.List bg="gray.100" borderRadius="md" p={1}>
            <Tabs.Trigger
              value="available"
              bg="transparent"
              color="gray.700"
              _selected={{
                bg: purple,
                color: "white",
              }}
              borderRadius="md"
              px={4}
              py={2}
              fontWeight="medium"
            >
              Available
              {availableDeliveries.length > 0 && (
                <Box
                  as="span"
                  ml={2}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  bg={lightPurple}
                  color="white"
                  fontSize="xs"
                >
                  {availableDeliveries.length}
                </Box>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger
              value="active"
              bg="transparent"
              color="gray.700"
              _selected={{
                bg: purple,
                color: "white",
              }}
              borderRadius="md"
              px={4}
              py={2}
              fontWeight="medium"
            >
              In Progress
              {activeDeliveries.length > 0 && (
                <Box
                  as="span"
                  ml={2}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  bg={lightPurple}
                  color="white"
                  fontSize="xs"
                >
                  {activeDeliveries.length}
                </Box>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger
              value="completed"
              bg="transparent"
              color="gray.700"
              _selected={{
                bg: purple,
                color: "white",
              }}
              borderRadius="md"
              px={4}
              py={2}
              fontWeight="medium"
            >
              Completed
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="available" pt={4}>
            {renderDeliveriesList(availableDeliveries, "No available deliveries")}
          </Tabs.Content>
          <Tabs.Content value="active" pt={4}>
            {renderDeliveriesList(activeDeliveries, "No active deliveries")}
          </Tabs.Content>
          <Tabs.Content value="completed" pt={4}>
            {renderDeliveriesList(completedDeliveries, "No completed deliveries")}
          </Tabs.Content>
        </Tabs.Root>
      </VStack>
    </Container>
  );
};
