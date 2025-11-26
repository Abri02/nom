import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { useRestaurant } from "../../hooks/useRestaurantContext";
import { purple, pink } from "../../../common/theme/colorScheme";
import { Navigate } from "react-router-dom";
import { MenuItemCard } from "../MenuItemCard";

export function MenuPage() {
  const { selectedRestaurant } = useRestaurant();

  if (!selectedRestaurant) {
    return <Navigate to="/restaurants" replace />;
  }

  return (
    <Box p={6} flex="1">
      <Box
        mb={8}
        p={8}
        borderRadius="xl"
        bg="white"
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
        <Heading size="4xl" color={purple} mb={3} fontWeight="extrabold">
          {selectedRestaurant.restaurantName}
        </Heading>
        {selectedRestaurant.openingHours && (
          <Text fontSize="xl" color="gray.700" fontWeight="medium">
            🕒 {selectedRestaurant.openingHours}
          </Text>
        )}
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {selectedRestaurant.menu.items.map((item) => (
          <MenuItemCard key={item.id} menuItem={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
