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

interface MenuItemCardProps {
  readonly menuItem: MenuItem;
}

export function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { addItem } = useCart();
  const { selectedRestaurant, selectedRestaurantId } = useRestaurant();

  const handleAddToCart = () => {
    if (selectedRestaurant && selectedRestaurantId) {
      addItem(
        menuItem,
        selectedRestaurant.restaurantName,
        selectedRestaurantId
      );
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
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "xl",
        borderColor: lightPurple,
        transition: "all 0.3s",
      }}
    >
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
