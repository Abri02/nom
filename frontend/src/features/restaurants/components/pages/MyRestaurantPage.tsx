import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Input,
  Textarea,
  VStack,
  HStack,
  IconButton,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import type { MenuItem } from "../../types/restaurant.types";
import {
  purple,
  pink,
  yellow,
  lightPurple,
} from "../../../common/theme/colorScheme";
import { useAuth } from "../../../auth/hooks/useAuthContext";
import {
  useGetRestaurantProfile,
  useUpdateRestaurantProfile,
  useAddMenuItem,
  useDeleteMenuItem,
} from "../../api/useRestaurantQueries";

interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  allergens: string;
  imageUrl: string;
}

export function MyRestaurantPage() {
  const { user } = useAuth();

  // Use the user ID as the restaurant ID for restaurant users
  const restaurantId = user?.id || "";

  const {
    data: restaurant,
    isLoading,
    error,
  } = useGetRestaurantProfile(restaurantId);
  const updateRestaurantMutation = useUpdateRestaurantProfile();
  const addMenuItemMutation = useAddMenuItem();
  const deleteMenuItemMutation = useDeleteMenuItem();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedHours, setEditedHours] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  const [newItem, setNewItem] = useState<MenuItemFormData>({
    name: "",
    description: "",
    price: "",
    allergens: "",
    imageUrl: "",
  });

  useState(() => {
    if (restaurant) {
      setEditedName(restaurant.restaurantName);
      setEditedHours(restaurant.openingHours || "");
    }
  });

  const handleSaveRestaurantInfo = async () => {
    try {
      await updateRestaurantMutation.mutateAsync({
        restaurantId,
        data: {
          restaurantName: editedName,
          openingHours: editedHours,
        },
      });
      setIsEditingInfo(false);
    } catch (err) {
      console.error("Failed to update restaurant info:", err);
    }
  };

  const handleCancelEditInfo = () => {
    setEditedName(restaurant?.restaurantName || "");
    setEditedHours(restaurant?.openingHours || "");
    setIsEditingInfo(false);
  };

  const handleAddMenuItem = async () => {
    if (!newItem.name || !newItem.price) return;

    try {
      await addMenuItemMutation.mutateAsync({
        restaurantId,
        data: {
          name: newItem.name,
          description: newItem.description || undefined,
          price: parseFloat(newItem.price),
          allergens: newItem.allergens
            ? newItem.allergens.split(",").map((a) => a.trim())
            : [],
          imageUrl: newItem.imageUrl || undefined,
        },
      });

      setNewItem({
        name: "",
        description: "",
        price: "",
        allergens: "",
        imageUrl: "",
      });
      setIsAddingItem(false);
    } catch (err) {
      console.error("Failed to add menu item:", err);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      await deleteMenuItemMutation.mutateAsync({
        restaurantId,
        menuItemId: itemId,
      });
    } catch (err) {
      console.error("Failed to delete menu item:", err);
    }
  };

  const handleCancelAdd = () => {
    setNewItem({
      name: "",
      description: "",
      price: "",
      allergens: "",
      imageUrl: "",
    });
    setIsAddingItem(false);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color={purple} />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Card.Root bg="red.50" borderColor="red.300" borderWidth="2px">
          <Card.Body p={6}>
            <Heading size="md" color="red.700" mb={2}>
              Error Loading Restaurant
            </Heading>
            <Text color="red.600">{error.message}</Text>
            <Text fontSize="sm" color="gray.600" mt={4}>
              Note: Make sure you're logged in as a restaurant user and your
              restaurant profile exists.
            </Text>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Box p={6}>
        <Card.Root bg="yellow.50" borderColor="yellow.300" borderWidth="2px">
          <Card.Body p={6}>
            <Heading size="md" color="yellow.700" mb={2}>
              No Restaurant Found
            </Heading>
            <Text color="yellow.600">
              Could not find restaurant profile for your account.
            </Text>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box p={6} flex="1" bg="gray.50" minH="100vh">
      <VStack gap={6} align="stretch" maxW="1200px" mx="auto">
        {/* Restaurant Information Card */}
        <Card.Root
          bg="white"
          shadow="md"
          borderRadius="lg"
          borderWidth="2px"
          borderColor={lightPurple}
        >
          <Card.Body p={6}>
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Heading size="lg" color={purple}>
                Restaurant Information
              </Heading>
              {!isEditingInfo ? (
                <Button
                  onClick={() => {
                    setEditedName(restaurant.restaurantName);
                    setEditedHours(restaurant.openingHours || "");
                    setIsEditingInfo(true);
                  }}
                  colorScheme="purple"
                  size="sm"
                  bg={purple}
                  color="white"
                  _hover={{ bg: lightPurple }}
                  disabled={updateRestaurantMutation.isPending}
                >
                  <Edit2 size={16} />
                  <Text ml={2}>Edit</Text>
                </Button>
              ) : (
                <HStack>
                  <IconButton
                    onClick={handleSaveRestaurantInfo}
                    colorScheme="green"
                    size="sm"
                    aria-label="Save"
                    disabled={updateRestaurantMutation.isPending}
                  >
                    {updateRestaurantMutation.isPending ? (
                      <Spinner size="sm" />
                    ) : (
                      <Save size={16} />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={handleCancelEditInfo}
                    colorScheme="red"
                    size="sm"
                    aria-label="Cancel"
                    disabled={updateRestaurantMutation.isPending}
                  >
                    <X size={16} />
                  </IconButton>
                </HStack>
              )}
            </Flex>

            {isEditingInfo ? (
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontWeight="600" mb={2} color={purple}>
                    Restaurant Name
                  </Text>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Restaurant name"
                    borderColor={lightPurple}
                    _focus={{ borderColor: pink }}
                  />
                </Box>
                <Box>
                  <Text fontWeight="600" mb={2} color={purple}>
                    Opening Hours
                  </Text>
                  <Input
                    value={editedHours}
                    onChange={(e) => setEditedHours(e.target.value)}
                    placeholder="e.g., Mon-Sun: 10:00 AM - 10:00 PM"
                    borderColor={lightPurple}
                    _focus={{ borderColor: pink }}
                  />
                </Box>
              </VStack>
            ) : (
              <VStack gap={3} align="stretch">
                <Box>
                  <Text fontWeight="600" color={purple}>
                    Name
                  </Text>
                  <Text fontSize="lg">{restaurant.restaurantName}</Text>
                </Box>
                <Box>
                  <Text fontWeight="600" color={purple}>
                    Opening Hours
                  </Text>
                  <Text>{restaurant.openingHours || "Not set"}</Text>
                </Box>
              </VStack>
            )}
          </Card.Body>
        </Card.Root>

        {/* Menu Management Card */}
        <Card.Root
          bg="white"
          shadow="md"
          borderRadius="lg"
          borderWidth="2px"
          borderColor={lightPurple}
        >
          <Card.Body p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="lg" color={purple}>
                Menu Items
              </Heading>
              <Button
                onClick={() => setIsAddingItem(true)}
                colorScheme="purple"
                bg={pink}
                color="white"
                _hover={{ bg: yellow, color: purple }}
                disabled={isAddingItem || addMenuItemMutation.isPending}
              >
                <Plus size={18} />
                <Text ml={2}>Add Menu Item</Text>
              </Button>
            </Flex>

            {/* Add New Item Form */}
            {isAddingItem && (
              <Card.Root
                mb={6}
                bg={`${lightPurple}10`}
                borderWidth="2px"
                borderColor={pink}
              >
                <Card.Body p={4}>
                  <Heading size="md" mb={4} color={purple}>
                    New Menu Item
                  </Heading>
                  <VStack gap={4} align="stretch">
                    <Box>
                      <Text fontWeight="600" mb={2} color={purple}>
                        Name *
                      </Text>
                      <Input
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                        placeholder="Item name"
                        borderColor={lightPurple}
                        _focus={{ borderColor: pink }}
                      />
                    </Box>
                    <Box>
                      <Text fontWeight="600" mb={2} color={purple}>
                        Description
                      </Text>
                      <Textarea
                        value={newItem.description}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the item"
                        borderColor={lightPurple}
                        _focus={{ borderColor: pink }}
                      />
                    </Box>
                    <Box>
                      <Text fontWeight="600" mb={2} color={purple}>
                        Price (Ft) *
                      </Text>
                      <Input
                        type="number"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem({ ...newItem, price: e.target.value })
                        }
                        placeholder="0"
                        borderColor={lightPurple}
                        _focus={{ borderColor: pink }}
                      />
                    </Box>
                    <Box>
                      <Text fontWeight="600" mb={2} color={purple}>
                        Allergens (comma-separated)
                      </Text>
                      <Input
                        value={newItem.allergens}
                        onChange={(e) =>
                          setNewItem({ ...newItem, allergens: e.target.value })
                        }
                        placeholder="e.g., gluten, dairy, nuts"
                        borderColor={lightPurple}
                        _focus={{ borderColor: pink }}
                      />
                    </Box>
                    <Box>
                      <Text fontWeight="600" mb={2} color={purple}>
                        Image URL
                      </Text>
                      <Input
                        value={newItem.imageUrl}
                        onChange={(e) =>
                          setNewItem({ ...newItem, imageUrl: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg"
                        borderColor={lightPurple}
                        _focus={{ borderColor: pink }}
                      />
                    </Box>
                    <HStack justify="flex-end" gap={3}>
                      <Button
                        onClick={handleCancelAdd}
                        variant="outline"
                        colorScheme="gray"
                        disabled={addMenuItemMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMenuItem}
                        colorScheme="purple"
                        bg={purple}
                        color="white"
                        _hover={{ bg: lightPurple }}
                        disabled={
                          !newItem.name ||
                          !newItem.price ||
                          addMenuItemMutation.isPending
                        }
                      >
                        {addMenuItemMutation.isPending ? (
                          <Spinner size="sm" />
                        ) : (
                          "Add Item"
                        )}
                      </Button>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            )}

            {/* Menu Items Grid */}
            {restaurant.menu?.items && restaurant.menu.items.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                {restaurant.menu.items.map((item: MenuItem) => (
                  <Card.Root
                    key={item.id}
                    borderWidth="1px"
                    borderColor={lightPurple}
                    _hover={{ shadow: "lg", borderColor: pink }}
                    transition="all 0.2s"
                  >
                    <Card.Body p={4}>
                      <VStack align="stretch" gap={2}>
                        <Heading size="md" color={purple}>
                          {item.name}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" lineClamp={2}>
                          {item.description || "No description"}
                        </Text>
                        <Text fontSize="xl" fontWeight="700" color={pink}>
                          {item.price} Ft
                        </Text>
                        {item.allergens && item.allergens.length > 0 && (
                          <HStack flexWrap="wrap" gap={2}>
                            {item.allergens.map(
                              (allergen: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  colorScheme="orange"
                                  fontSize="xs"
                                >
                                  {allergen}
                                </Badge>
                              )
                            )}
                          </HStack>
                        )}
                        <HStack justify="flex-end" gap={2} mt={2}>
                          <IconButton
                            onClick={() => handleDeleteMenuItem(item.id)}
                            colorScheme="red"
                            size="sm"
                            aria-label="Delete"
                            disabled={deleteMenuItemMutation.isPending}
                          >
                            {deleteMenuItemMutation.isPending ? (
                              <Spinner size="xs" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </IconButton>
                        </HStack>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">
                  No menu items yet. Click "Add Menu Item" to get started!
                </Text>
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}
