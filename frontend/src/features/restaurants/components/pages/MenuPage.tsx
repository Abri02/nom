import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { purple, pink, yellow } from "../../../common/theme/colorScheme";
import { Navigate, useParams } from "react-router-dom";
import { MenuItemCard } from "../MenuItemCard";
import { useGetRestaurantProfile } from "../../api/useRestaurantQueries";
import { useRestaurant } from "../../hooks/useRestaurantContext";
import { useEffect } from "react";

export function MenuPage() {
  const { id: restaurantId } = useParams<{ id: string }>();
  const { setSelectedRestaurant } = useRestaurant();

  const { data: restaurant, isLoading, error } = useGetRestaurantProfile(restaurantId || "");

  useEffect(() => {
    if (restaurant && restaurantId) {
      setSelectedRestaurant(restaurant, restaurantId);
    }
  }, [restaurant, restaurantId, setSelectedRestaurant]);

  if (!restaurantId) {
    return <Navigate to="/restaurants" replace />;
  }

  if (isLoading) {
    return <Box p={6}>Loading restaurant menu...</Box>;
  }

  if (error || !restaurant) {
    return <Box p={6}>Error loading restaurant: {error?.message || "Restaurant not found"}</Box>;
  }

  return (
    <Box p={6} flex="1">
      <Box
        mb={8}
        p={8}
        borderRadius="xl"
        bg={purple}
        boxShadow="xl"
        borderWidth="4px"
        borderColor={pink}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          bgGradient: `linear(to-r, ${purple}, ${pink})`,
        }}
      >
        <Heading size="4xl" color={yellow} mb={3} fontWeight="extrabold">
          {restaurant.restaurantName}
        </Heading>
        {restaurant.openingHours && (
          <Text fontSize="xl" color={yellow} fontWeight="medium">
            🕒 {restaurant.openingHours}
          </Text>
        )}
        {restaurant.description && (
          <Text mt={4} fontSize="lg" color={yellow}>
            {restaurant.description}
          </Text>
        )}
      </Box>

      {restaurant.menu && restaurant.menu.items.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {restaurant.menu.items.map((item) => (
            <MenuItemCard key={item.id} menuItem={item} />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" color="gray.500">
            No menu items available
          </Text>
        </Box>
      )}
    </Box>
  );
}
