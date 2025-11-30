import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  Dialog,
  Input,
  Textarea,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";
import {
  useGetAllRestaurants,
  useGetRestaurantProfile,
  useUpdateRestaurantProfile,
  useAddMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "../../../restaurants/api/useRestaurantQueries";
import type { MenuItem } from "../../../restaurants/types/restaurant.types";
import { toaster } from "../../../../components/ui/toaster";
import { purple, pink, yellow } from "../../../common/theme/colorScheme";

export const RestaurantsManagementPage = () => {
  const { data: restaurants, isLoading, error } = useGetAllRestaurants();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    restaurantName: "",
    openingHours: "",
  });
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    allergens: "",
    imageUrl: "",
  });

  const { data: selectedRestaurant } = useGetRestaurantProfile(
    selectedRestaurantId || ""
  );
  const updateProfileMutation = useUpdateRestaurantProfile();
  const addMenuItemMutation = useAddMenuItem();
  const updateMenuItemMutation = useUpdateMenuItem();
  const deleteMenuItemMutation = useDeleteMenuItem();

  const openProfileDialog = (
    restaurantId: string,
    name: string,
    hours: string
  ) => {
    setSelectedRestaurantId(restaurantId);
    setProfileData({
      restaurantName: name,
      openingHours: hours,
    });
    setIsProfileDialogOpen(true);
  };

  const openMenuDialog = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setIsMenuDialogOpen(true);
    setIsAddingItem(false);
    setEditingMenuItem(null);
  };

  const handleUpdateProfile = async () => {
    if (!selectedRestaurantId) return;

    try {
      await updateProfileMutation.mutateAsync({
        restaurantId: selectedRestaurantId,
        data: profileData,
      });
      toaster.create({
        title: "Profile updated",
        type: "success",
        duration: 3000,
      });
      setIsProfileDialogOpen(false);
    } catch (error) {
      toaster.create({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleAddMenuItem = async () => {
    if (!selectedRestaurantId || !menuItemForm.name || !menuItemForm.price)
      return;

    try {
      await addMenuItemMutation.mutateAsync({
        restaurantId: selectedRestaurantId,
        data: {
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: parseInt(menuItemForm.price),
          allergens: menuItemForm.allergens
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean),
          imageUrl: menuItemForm.imageUrl,
        },
      });
      toaster.create({
        title: "Menu item added",
        type: "success",
        duration: 3000,
      });
      setIsAddingItem(false);
      setMenuItemForm({
        name: "",
        description: "",
        price: "",
        allergens: "",
        imageUrl: "",
      });
    } catch (error) {
      toaster.create({
        title: "Failed to add menu item",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleUpdateMenuItem = async () => {
    if (
      !selectedRestaurantId ||
      !editingMenuItem ||
      !menuItemForm.name ||
      !menuItemForm.price
    )
      return;

    try {
      await updateMenuItemMutation.mutateAsync({
        restaurantId: selectedRestaurantId,
        menuItemId: editingMenuItem.id,
        data: {
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: parseInt(menuItemForm.price),
          allergens: menuItemForm.allergens
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean),
          imageUrl: menuItemForm.imageUrl,
        },
      });
      toaster.create({
        title: "Menu item updated",
        type: "success",
        duration: 3000,
      });
      setEditingMenuItem(null);
      setMenuItemForm({
        name: "",
        description: "",
        price: "",
        allergens: "",
        imageUrl: "",
      });
    } catch (error) {
      toaster.create({
        title: "Failed to update menu item",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleDeleteMenuItem = async (menuItemId: string) => {
    if (
      !selectedRestaurantId ||
      !window.confirm("Are you sure you want to delete this menu item?")
    )
      return;

    try {
      await deleteMenuItemMutation.mutateAsync({
        restaurantId: selectedRestaurantId,
        menuItemId,
      });
      toaster.create({
        title: "Menu item deleted",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Failed to delete menu item",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
        duration: 3000,
      });
    }
  };

  const startEditingMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuItemForm({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      allergens: item.allergens.join(", "),
      imageUrl: item.imageUrl || "",
    });
    setIsAddingItem(false);
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
            Error loading restaurants
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
          <Heading size="lg">Restaurant Management</Heading>
          <Text color="gray.600" mt={2}>
            Total Restaurants: {restaurants?.length || 0}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          {restaurants?.map((restaurant) => (
            <Card.Root key={restaurant.id}>
              <Card.Body>
                <VStack align="stretch" gap={3}>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">
                      {restaurant.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {restaurant.email}
                    </Text>
                  </Box>

                  <HStack gap={2}>
                    <Button
                      size="sm"
                      bg={purple}
                      color="white"
                      _hover={{ bg: pink }}
                      onClick={() =>
                        openProfileDialog(restaurant.id, restaurant.name, "")
                      }
                      flex={1}
                    >
                      <Edit size={14} />
                      Edit Profile
                    </Button>
                    <Button
                      size="sm"
                      bg={pink}
                      color="white"
                      _hover={{ bg: purple }}
                      onClick={() => openMenuDialog(restaurant.id)}
                      flex={1}
                    >
                      Menu Items
                    </Button>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>

        {(!restaurants || restaurants.length === 0) && (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">No restaurants found</Text>
          </Box>
        )}
      </VStack>

      <Dialog.Root
        open={isProfileDialogOpen}
        onOpenChange={(e) => setIsProfileDialogOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit Restaurant Profile</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Restaurant Name
                  </Text>
                  <Input
                    value={profileData.restaurantName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        restaurantName: e.target.value,
                      })
                    }
                    color="black"
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color="black">
                    Opening Hours
                  </Text>
                  <Input
                    value={profileData.openingHours}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        openingHours: e.target.value,
                      })
                    }
                    placeholder="e.g., Mon-Fri: 9AM-10PM"
                    color="black"
                  />
                </Box>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={2}>
                <Button
                  variant="ghost"
                  onClick={() => setIsProfileDialogOpen(false)}
                  color="black"
                  bg={yellow}
                >
                  Cancel
                </Button>
                <Button
                  bg={purple}
                  color="white"
                  _hover={{ bg: pink }}
                  onClick={handleUpdateProfile}
                  loading={updateProfileMutation.isPending}
                >
                  Save Changes
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <Dialog.Root
        open={isMenuDialogOpen}
        onOpenChange={(e) => setIsMenuDialogOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="3xl">
            <Dialog.Header>
              <Dialog.Title>Manage Menu Items</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Button
                  bg={pink}
                  color="white"
                  _hover={{ bg: purple }}
                  onClick={() => {
                    setIsAddingItem(true);
                    setEditingMenuItem(null);
                    setMenuItemForm({
                      name: "",
                      description: "",
                      price: "",
                      allergens: "",
                      imageUrl: "",
                    });
                  }}
                >
                  <Plus size={16} />
                  Add New Menu Item
                </Button>

                {(isAddingItem || editingMenuItem) && (
                  <Card.Root bg="gray.50">
                    <Card.Body>
                      <VStack gap={3} align="stretch">
                        <HStack justify="space-between">
                          <Text fontWeight="bold" color="black">
                            {isAddingItem ? "New Menu Item" : "Edit Menu Item"}
                          </Text>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setIsAddingItem(false);
                              setEditingMenuItem(null);
                              setMenuItemForm({
                                name: "",
                                description: "",
                                price: "",
                                allergens: "",
                                imageUrl: "",
                              });
                            }}
                          >
                            <X size={16} />
                          </IconButton>
                        </HStack>
                        <Input
                          placeholder="Name"
                          value={menuItemForm.name}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              name: e.target.value,
                            })
                          }
                          color="black"
                        />
                        <Textarea
                          placeholder="Description"
                          value={menuItemForm.description}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              description: e.target.value,
                            })
                          }
                          color="black"
                        />
                        <Input
                          placeholder="Price (in Ft)"
                          type="number"
                          value={menuItemForm.price}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              price: e.target.value,
                            })
                          }
                          color="black"
                        />
                        <Input
                          placeholder="Allergens (comma separated)"
                          value={menuItemForm.allergens}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              allergens: e.target.value,
                            })
                          }
                          color="black"
                        />
                        <Input
                          placeholder="Image URL"
                          value={menuItemForm.imageUrl}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              imageUrl: e.target.value,
                            })
                          }
                          color="black"
                        />
                        <Button
                          bg={purple}
                          color="white"
                          _hover={{ bg: pink }}
                          onClick={
                            isAddingItem
                              ? handleAddMenuItem
                              : handleUpdateMenuItem
                          }
                          loading={
                            addMenuItemMutation.isPending ||
                            updateMenuItemMutation.isPending
                          }
                        >
                          <Save size={16} />
                          {isAddingItem ? "Add Item" : "Save Changes"}
                        </Button>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                )}

                <VStack gap={3} align="stretch">
                  {selectedRestaurant?.menu?.items?.map((item: MenuItem) => (
                    <Card.Root key={item.id}>
                      <Card.Body>
                        <HStack justify="space-between">
                          <Box flex={1}>
                            <Text fontWeight="bold">{item.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {item.description}
                            </Text>
                            <HStack mt={1} gap={2}>
                              <Badge colorScheme="green">{item.price} Ft</Badge>
                              {item.allergens.length > 0 && (
                                <Badge colorScheme="orange">
                                  Allergens: {item.allergens.join(", ")}
                                </Badge>
                              )}
                            </HStack>
                          </Box>
                          <HStack>
                            <IconButton
                              size="sm"
                              bg={purple}
                              color="white"
                              _hover={{ bg: pink }}
                              onClick={() => startEditingMenuItem(item)}
                            >
                              <Edit size={16} />
                            </IconButton>
                            <IconButton
                              size="sm"
                              bg="red.500"
                              color="white"
                              _hover={{ bg: "red.600" }}
                              onClick={() => handleDeleteMenuItem(item.id)}
                              loading={deleteMenuItemMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </HStack>
                        </HStack>
                      </Card.Body>
                    </Card.Root>
                  ))}
                </VStack>

                {selectedRestaurant &&
                  (!selectedRestaurant.menu?.items ||
                    selectedRestaurant.menu.items.length === 0) &&
                  !isAddingItem && (
                    <Box textAlign="center" py={6}>
                      <Text color="gray.500">No menu items yet</Text>
                    </Box>
                  )}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="ghost"
                onClick={() => setIsMenuDialogOpen(false)}
                color="black"
              >
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Container>
  );
};
