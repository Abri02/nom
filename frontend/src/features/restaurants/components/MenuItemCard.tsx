
import { Box, Text, HStack, Badge, Button } from "@chakra-ui/react";
import type { MenuItem } from "../types/restaurant.types";
import {
  purple,
  pink,
  yellow,
  lightPurple,
} from "../../common/theme/colorScheme";
import { useCart } from "../../cart/hooks/useCartContext";
import { useRestaurant } from "../hooks/useRestaurantContext";
import { NomButtons } from "../../common/components/NomButton";
import {
  useAddFavouriteMenuItem,
  useIsFavouriteMenuItem,
  useRemoveFavouriteMenuItem,
} from "../api/useRestaurantQueries"; 

interface MenuItemCardProps {
  readonly menuItem: MenuItem;
}

export function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { addItem } = useCart();
  const { selectedRestaurant, selectedRestaurantId } = useRestaurant();

  const addFavouriteMenuItem = useAddFavouriteMenuItem();
  const removeFavouriteMenuItem = useRemoveFavouriteMenuItem();
  const isFavouriteMenuItemQuery = useIsFavouriteMenuItem(
    selectedRestaurantId || "",
    menuItem.id
  );

  const isFavourite = isFavouriteMenuItemQuery.data === true;
  const isPending =
    addFavouriteMenuItem.isPending || removeFavouriteMenuItem.isPending;

  const handleAddToCart = () => {
    if (selectedRestaurant && selectedRestaurantId) {
      addItem(
        menuItem,
        selectedRestaurant.restaurantName,
        selectedRestaurantId
      );
    }
  };

  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedRestaurantId) return;

    const request = {
      restaurantId: selectedRestaurantId,
      menuItemId: menuItem.id,
    };

    if (isFavourite) {
      removeFavouriteMenuItem.mutate(request, {
        onSuccess: () => isFavouriteMenuItemQuery.refetch(),
      });
    } else {
      addFavouriteMenuItem.mutate(request, {
        onSuccess: () => isFavouriteMenuItemQuery.refetch(),
      });
    }
  };

  return (
    <Box
      borderWidth="3px"
      borderColor={pink}
      borderRadius="xl"
      overflow="hidden"
      bg={purple}
      boxShadow="lg"
      position="relative" 
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "xl",
        borderColor: lightPurple,
        transition: "all 0.3s",
      }}
    >
      {selectedRestaurantId && (
        <Box
          as="button"
          aria-label="Toggle favourite menu item"
          position="absolute"
          top={4}
          right={4}
          fontSize="2xl"
          onClick={handleFavouriteClick}
          cursor="pointer"
          _hover={{ transform: "scale(1.2)" }}
          transition="transform 0.2s"
          bg="transparent"
          border="none"
          zIndex={10}
          opacity={isPending ? 0.5 : 1}
        >
          {isFavourite ? "❤️" : "🤍"}
        </Box>
      )}

      <Box
        h="180px"
        bg={lightPurple}
        backgroundImage={
          menuItem.imageUrl ? `url(${menuItem.imageUrl})` : undefined
        }
        backgroundSize="cover"
        backgroundPosition="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {!menuItem.imageUrl && (
          <Text fontSize="4xl" color={yellow}>
            🍽️
          </Text>
        )}
      </Box>

      <Box p={5}>
        <Text fontSize="2xl" fontWeight="bold" color={yellow} mb={2}>
          {menuItem.name}
        </Text>

        <Text fontSize="md" color={yellow} mb={4} minH="40px">
          {menuItem.description || "No description available"}
        </Text>

        <Text fontSize="3xl" fontWeight="bold" color={yellow} mb={3}>
          {menuItem.price} Ft
        </Text>

        {menuItem.allergens.length > 0 && (
          <HStack gap={2} flexWrap="wrap" mb={3}>
            {menuItem.allergens.map((allergen) => (
              <Badge key={allergen} bgColor={yellow} color={"black"} size="md">
                {allergen}
              </Badge>
            ))}
          </HStack>
        )}

        <NomButtons
          width="full"
          onClick={handleAddToCart}
          title="Add to Cart"
        ></NomButtons>
      </Box>
    </Box>
  );
}