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
import { useCancelOrder, useUserOrders } from "../../api/useOrderQueries";
import { OrderCard } from "../OrderCard";
import type { Order } from "../../types/order.types";
import { purple, lightPurple } from "../../../common/theme/colorScheme";

export const OrdersPage = () => {
  const { data: orders, isLoading, error } = useUserOrders();
  const cancelOrderMutation = useCancelOrder();

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
      } catch (error) {
        console.error("Failed to cancel order:", error);
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
        <VStack gap={6} align="stretch">
          <Heading size="xl">My Orders</Heading>
          <Center py={12}>
            <VStack gap={2}>
              <Text fontSize="lg" color="gray.600">
                You don't have any orders
              </Text>
            </VStack>
          </Center>
        </VStack>
      </Container>
    );
  }

  const activeOrders = orders?.filter(
    (order) => !["DELIVERED", "CANCELLED"].includes(order.status)
  ) || [];

  const pastOrders = orders?.filter(
    (order) => ["DELIVERED", "CANCELLED"].includes(order.status)
  ) || [];

  const renderOrdersList = (ordersList: Order[], emptyMessage: string) => {
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
      <VStack gap={4} align="stretch">
        {ordersList.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancelOrder={handleCancelOrder}
          />
        ))}
      </VStack>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Heading size="xl">My Orders</Heading>

        <Tabs.Root defaultValue="active" variant="enclosed">
          <Tabs.List
            bg="gray.100"
            borderRadius="md"
            p={1}
          >
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
              Active Orders
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
              value="history"
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
              Order History
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="active" pt={4}>
            {renderOrdersList(activeOrders, "You have no active orders")}
          </Tabs.Content>
          <Tabs.Content value="history" pt={4}>
            {renderOrdersList(pastOrders, "No past orders")}
          </Tabs.Content>
        </Tabs.Root>
      </VStack>
    </Container>
  );
};
