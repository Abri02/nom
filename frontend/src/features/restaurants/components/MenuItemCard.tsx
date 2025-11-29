import { Box, Text, HStack, Badge, Button } from "@chakra-ui/react";
import type { MenuItem } from "../types/restaurant.types";
import { purple, pink, yellow } from "../../common/theme/colorScheme";
import { useCart } from "../../cart/hooks/useCartContext";
import { useRestaurant } from "../hooks/useRestaurantContext";

interface MenuItemCardProps {
  readonly menuItem: MenuItem;
}

export function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { addItem } = useCart();
  const { selectedRestaurant, selectedRestaurantId } = useRestaurant();

  const handleAddToCart = () => {
    if (selectedRestaurant && selectedRestaurantId) {
      addItem(menuItem, selectedRestaurant.restaurantName, selectedRestaurantId);
    }
  };

  return (
    <Box
      borderWidth="3px"
      borderColor={pink}
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      boxShadow="lg"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "xl",
        borderColor: purple,
        transition: "all 0.3s",
      }}
    >
      <Box
        h="180px"
        bg="gray.300"
        backgroundImage={menuItem.imageUrl}
        backgroundSize="cover"
        backgroundPosition="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {!menuItem.imageUrl && (
          <Text fontSize="4xl" color="gray.500">
            🍽️
          </Text>
        )}
      </Box>

      <Box p={5}>
        <Text fontSize="2xl" fontWeight="bold" color={purple} mb={2}>
          {menuItem.name}
        </Text>

        <Text fontSize="md" color="gray.700" mb={4} minH="40px">
          {menuItem.description || "No description available"}
        </Text>

        <Text fontSize="3xl" fontWeight="bold" color={yellow} mb={3}>
          {menuItem.price} Ft
        </Text>

        {menuItem.allergens.length > 0 && (
          <HStack gap={2} flexWrap="wrap" mb={3}>
            {menuItem.allergens.map((allergen) => (
              <Badge key={allergen} colorPalette="red" size="sm">
                {allergen}
              </Badge>
            ))}
          </HStack>
        )}

        <Button
          width="full"
          bg={purple}
          color="white"
          _hover={{ bg: pink }}
          size="lg"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
  );
}
