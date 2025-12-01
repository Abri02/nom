import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
  Card,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Users, ShoppingBag, Package, Store } from "lucide-react";
import { useAllOrders, useAllUsers } from "../../api/useAdminQueries";
import { yellow } from "../../../common/theme/colorScheme";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: users, isLoading: usersLoading } = useAllUsers();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();

  const isLoading = usersLoading || ordersLoading;

  const totalUsers = users?.length || 0;
  const totalOrders = orders?.length || 0;
  const activeOrders =
    orders?.filter(
      (order) => order.status !== "DELIVERED" && order.status !== "CANCELLED"
    ).length || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;

  if (isLoading) {
    return (
      <Center h="calc(100vh - 100px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Admin Dashboard
          </Heading>
          <Text color="gray.600">
            Welcome to the admin panel. Manage users, orders, and monitor system
            activity.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          <Card.Root>
            <Card.Body>
              <VStack align="stretch" gap={2}>
                <HStack gap={3}>
                  <Box p={2} bg="blue.100" borderRadius="md">
                    <Users size={24} color="#3182CE" />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Total Users
                  </Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="bold">
                  {totalUsers}
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <VStack align="stretch" gap={2}>
                <HStack gap={3}>
                  <Box p={2} bg="green.100" borderRadius="md">
                    <ShoppingBag size={24} color="#38A169" />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Total Orders
                  </Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="bold">
                  {totalOrders}
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <VStack align="stretch" gap={2}>
                <HStack gap={3}>
                  <Box p={2} bg="orange.100" borderRadius="md">
                    <Package size={24} color="#DD6B20" />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Active Orders
                  </Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="bold">
                  {activeOrders}
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <VStack align="stretch" gap={2}>
                <HStack gap={3}>
                  <Box p={2} bg="purple.100" borderRadius="md">
                    <Text fontSize="2xl">💰</Text>
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Total Revenue
                  </Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">
                  {totalRevenue.toLocaleString()} Ft
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        <Box>
          <Heading size="md" mb={4}>
            Quick Actions
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            <Card.Root
              _hover={{ shadow: "lg", cursor: "pointer" }}
              onClick={() => navigate("/admin/users")}
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <HStack>
                    <Users size={20} />
                    <Heading size="sm">Manage Users</Heading>
                  </HStack>
                  <Text color="gray.600" fontSize="sm">
                    View and manage all registered users in the system
                  </Text>
                  <Button size="sm" bg={yellow} variant="outline">
                    Go to Users
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              _hover={{ shadow: "lg", cursor: "pointer" }}
              onClick={() => navigate("/admin/orders")}
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <HStack>
                    <ShoppingBag size={20} />
                    <Heading size="sm">Manage Orders</Heading>
                  </HStack>
                  <Text color="gray.600" fontSize="sm">
                    View, update, and cancel orders across all restaurants
                  </Text>
                  <Button size="sm" bg={yellow} variant="outline">
                    Go to Orders
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              _hover={{ shadow: "lg", cursor: "pointer" }}
              onClick={() => navigate("/admin/restaurants")}
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <HStack>
                    <Store size={20} />
                    <Heading size="sm">Manage Restaurants</Heading>
                  </HStack>
                  <Text color="gray.600" fontSize="sm">
                    Edit restaurant profiles and manage menu items
                  </Text>
                  <Button size="sm" bg={yellow} variant="outline">
                    Go to Restaurants
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
};
