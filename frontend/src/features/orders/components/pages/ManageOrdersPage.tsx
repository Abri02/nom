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
import {
  useAllRestaurantOrders,
  useAcceptOrder,
  useDeclineOrder,
  useMarkOrderReady,
} from "../../api/useOrderQueries";
import { RestaurantOrderCard } from "../RestaurantOrderCard";
import type { OrderDetail } from "../../types/order.types";
import { purple, lightPurple } from "../../../common/theme/colorScheme";

export const ManageOrdersPage = () => {
  const { data: orders, isLoading, error } = useAllRestaurantOrders();
  const acceptOrderMutation = useAcceptOrder();
  const declineOrderMutation = useDeclineOrder();
  const markReadyMutation = useMarkOrderReady();

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await acceptOrderMutation.mutateAsync(orderId);
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to decline this order?")) {
      try {
        await declineOrderMutation.mutateAsync(orderId);
      } catch (error) {
        console.error("Failed to decline order:", error);
      }
    }
  };

  const handleMarkReady = async (orderId: string) => {
    try {
      await markReadyMutation.mutateAsync(orderId);
    } catch (error) {
      console.error("Failed to mark order as ready:", error);
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
            Error loading orders
          </Heading>
          <Text color="red.700">
            {error instanceof Error
              ? error.message
              : "Failed to load orders. Please try again later."}
          </Text>
        </Box>
      </Container>
    );
  }

  const pendingOrders = orders?.filter((order) => order.status === "NEW") || [];
  const activeOrders =
    orders?.filter((order) =>
      ["PREPARING", "READY"].includes(order.status)
    ) || [];
  const completedOrders =
    orders?.filter((order) =>
      ["ON_DELIVERY", "DELIVERED"].includes(order.status)
    ) || [];

  const renderOrdersList = (ordersList: OrderDetail[], emptyMessage: string) => {
    if (ordersList.length === 0) {
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
      <VStack  gap={4} align="stretch">
        {ordersList.map((order) => (
          <RestaurantOrderCard
          
            key={order.id}
            order={order}
            onAccept={handleAcceptOrder}
            onDecline={handleDeclineOrder}
            onMarkReady={handleMarkReady}
          />
        ))}
      </VStack>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Heading size="xl">Manage Orders</Heading>

        <Tabs.Root defaultValue="pending" variant="enclosed">
          <Tabs.List bg="gray.100" borderRadius="md" p={1}>
            <Tabs.Trigger
              value="pending"
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
              Pending
              {pendingOrders.length > 0 && (
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
                  {pendingOrders.length}
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
              {activeOrders.length > 0 && (
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
                  {activeOrders.length}
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

          <Tabs.Content value="pending" pt={4}>
            {renderOrdersList(pendingOrders, "No pending orders")}
          </Tabs.Content>
          <Tabs.Content value="active" pt={4}>
            {renderOrdersList(activeOrders, "No active orders")}
          </Tabs.Content>
          <Tabs.Content value="completed" pt={4}>
            {renderOrdersList(completedOrders, "No completed orders")}
          </Tabs.Content>
        </Tabs.Root>
      </VStack>
    </Container>
  );
};
