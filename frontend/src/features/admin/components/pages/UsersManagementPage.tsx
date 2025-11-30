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
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { Edit } from "lucide-react";
import { useAllUsers, useUpdateUser } from "../../api/useAdminQueries";
import type { User } from "../../types/admin.types";
import { toaster } from "../../../../components/ui/toaster";
import { purple, pink, yellow } from "../../../common/theme/colorScheme";

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "red";
    case "RESTAURANT":
      return "purple";
    case "COURIER":
      return "blue";
    case "CUSTOMER":
      return "green";
    default:
      return "gray";
  }
};

export const UsersManagementPage = () => {
  const { data: users, isLoading, error } = useAllUsers();
  const updateUserMutation = useUpdateUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    street: "",
    streetNumber: "",
    city: "",
    zipCode: "",
    role: "CUSTOMER" as User["role"],
  });

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      street: user.street,
      streetNumber: user.streetNumber,
      city: user.city,
      zipCode: user.zipCode,
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        ...formData,
      });
      toaster.create({
        title: "User updated",
        type: "success",
        duration: 3000,
      });
      setIsDialogOpen(false);
    } catch (error) {
      toaster.create({
        title: "Failed to update user",
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
            Error loading users
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
          <Heading size="lg">User Management</Heading>
          <Text color="gray.600" mt={2}>
            Total Users: {users?.length || 0}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          {users?.map((user: User) => (
            <Card.Root key={user.id}>
              <Card.Body>
                <VStack align="stretch" gap={3}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="lg" fontWeight="bold">
                        {user.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {user.email}
                      </Text>
                    </Box>
                    <Button
                      size="sm"
                      bg={purple}
                      color="white"
                      _hover={{ bg: pink }}
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit size={14} />
                      Edit
                    </Button>
                  </HStack>

                  <SimpleGrid columns={2} gap={3}>
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Role
                      </Text>
                      <Badge colorScheme={getRoleBadgeColor(user.role)} mt={1}>
                        {user.role}
                      </Badge>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Status
                      </Text>
                      <Badge
                        colorScheme={user.isSuspended ? "red" : "green"}
                        mt={1}
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </Badge>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Phone
                      </Text>
                      <Text fontSize="sm" mt={1}>
                        {user.phoneNumber}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Joined
                      </Text>
                      <Text fontSize="sm" mt={1}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">
                      Address
                    </Text>
                    <Text fontSize="sm" mt={1}>
                      {user.street} {user.streetNumber}, {user.city}{" "}
                      {user.zipCode}
                    </Text>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>

        {(!users || users.length === 0) && (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">No users found</Text>
          </Box>
        )}
      </VStack>

      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(e) => setIsDialogOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="lg">
            <Dialog.Header>
              <Dialog.Title>Edit User</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Name
                  </Text>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    color="black"
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Email
                  </Text>
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    color="black"
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Role
                  </Text>
                  <HStack gap={2}>
                    {(["CUSTOMER", "RESTAURANT", "COURIER", "ADMIN"] as const).map(
                      (role) => (
                        <Button
                          key={role}
                          size="sm"
                          bg={formData.role === role ? purple : "gray.200"}
                          color={formData.role === role ? "white" : "black"}
                          _hover={{
                            bg: formData.role === role ? pink : "gray.300",
                          }}
                          onClick={() => setFormData({ ...formData, role })}
                        >
                          {role}
                        </Button>
                      )
                    )}
                  </HStack>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Phone Number
                  </Text>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    color="black"
                  />
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="black">
                      Street
                    </Text>
                    <Input
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      color="black"
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="black">
                      Street Number
                    </Text>
                    <Input
                      value={formData.streetNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          streetNumber: e.target.value,
                        })
                      }
                      color="black"
                    />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="black">
                      City
                    </Text>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      color="black"
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="black">
                      Zip Code
                    </Text>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      color="black"
                    />
                  </Box>
                </SimpleGrid>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={2}>
                <Button
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  color="black"
                  bg={yellow}
                >
                  Cancel
                </Button>
                <Button
                  bg={purple}
                  color="white"
                  _hover={{ bg: pink }}
                  onClick={handleUpdateUser}
                  loading={updateUserMutation.isPending}
                >
                  Save Changes
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Container>
  );
};
