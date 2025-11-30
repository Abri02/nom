import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Spinner,
  Text,
  Badge,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  Dialog,
} from "@chakra-ui/react";
import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import {
  useAllOrders,
  useCancelOrder,
  useUpdateOrder,
} from "../../api/useAdminQueries";
import type {
  OrderDetail,
  OrderStatus,
} from "../../../orders/types/order.types";
import { toaster } from "../../../../components/ui/toaster";
import { purple, pink, yellow } from "../../../common/theme/colorScheme";

const getStatusBadgeColor = (status: OrderStatus) => {
  switch (status) {
    case "NEW":
      return "blue";
    case "PREPARING":
      return "orange";
    case "READY":
      return "purple";
    case "ON_DELIVERY":
      return "cyan";
    case "DELIVERED":
      return "green";
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
};

const STATUS_OPTIONS: OrderStatus[] = [
  "NEW",
  "PREPARING",
  "READY",
  "ON_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export const OrdersManagementPage = () => {
  const { data: orders, isLoading, error } = useAllOrders();
  const cancelOrderMutation = useCancelOrder();
  const updateOrderMutation = useUpdateOrder();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("NEW");

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrderMutation.mutateAsync(orderId);
      toaster.create({
        title: "Order cancelled",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Failed to cancel order",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
        duration: 3000,
      });
    }
  };

  const openUpdateDialog = (order: OrderDetail) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderMutation.mutateAsync({
        ...selectedOrder,
        status: newStatus,
      });
      toaster.create({
        title: "Order updated",
        type: "success",
        duration: 3000,
      });
      setIsDialogOpen(false);
    } catch (error) {
      toaster.create({
        title: "Failed to update order",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Center h="calc(100vh - 100px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="calc(100vh - 100px)">
        <VStack gap={4}>
          <Text fontSize="xl" fontWeight="bold" color="red.500">
            Error loading orders
          </Text>
          <Text>{error.message}</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="lg">Order Management</Heading>
          <Text color="gray.600" mt={2}>
            Total Orders: {orders?.length || 0}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          {orders?.map((order: OrderDetail) => (
            <Card.Root key={order.id}>
              <Card.Body>
                <VStack align="stretch" gap={3}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Order ID
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {order.id?.substring(0, 12)}...
                      </Text>
                    </Box>
                    <Badge colorScheme={getStatusBadgeColor(order.status)}>
                      {order.status}
                    </Badge>
                  </HStack>

                  <SimpleGrid columns={2} gap={3}>
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Restaurant
                      </Text>
                      <Text fontSize="sm" mt={1}>
                        {order.restaurantName}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Total Price
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" mt={1}>
                        {order.totalPrice} Ft
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Customer ID
                      </Text>
                      <Text fontSize="xs" mt={1}>
                        {order.customerId.substring(0, 8)}...
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Created
                      </Text>
                      <Text fontSize="xs" mt={1}>
                        {new Date(order.createdAt).toLocaleString()}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  <HStack gap={2}>
                    <Button
                      size="sm"
                      bg={purple}
                      color="white"
                      _hover={{ bg: pink }}
                      onClick={() => openUpdateDialog(order)}
                      flex={1}
                    >
                      <Edit size={14} />
                      Edit Status
                    </Button>
                    <Button
                      size="sm"
                      bg="red.500"
                      color="white"
                      _hover={{ bg: "red.600" }}
                      onClick={() => order.id && handleCancelOrder(order.id)}
                      loading={cancelOrderMutation.isPending}
                      disabled={order.status === "CANCELLED"}
                      flex={1}
                    >
                      <Trash2 size={14} />
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>

        {(!orders || orders.length === 0) && (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">No orders found</Text>
          </Box>
        )}
      </VStack>

      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(e) => setIsDialogOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Update Order Status</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Order ID:
                  </Text>
                  <Text fontSize="sm" color="black">
                    {selectedOrder?.id}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Restaurant:
                  </Text>
                  <Text color="black">{selectedOrder?.restaurantName}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Current Status:
                  </Text>
                  <Badge
                    colorScheme={getStatusBadgeColor(
                      selectedOrder?.status || "NEW"
                    )}
                  >
                    {selectedOrder?.status}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    New Status:
                  </Text>
                  <VStack align="stretch" gap={2}>
                    {STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status}
                        bg={newStatus === status ? purple : "gray.200"}
                        color={newStatus === status ? "white" : "black"}
                        _hover={{
                          bg: newStatus === status ? pink : "gray.300",
                        }}
                        onClick={() => setNewStatus(status)}
                        size="sm"
                      >
                        {status}
                      </Button>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={2}>
                <Button
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  bg={yellow}
                >
                  Cancel
                </Button>
                <Button
                  bg={purple}
                  color="white"
                  _hover={{ bg: pink }}
                  onClick={handleUpdateOrder}
                  loading={updateOrderMutation.isPending}
                >
                  Update
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Container>
  );
};
