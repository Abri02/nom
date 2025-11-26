import { Box, Text } from "@chakra-ui/react";
import type { RestaurantProfile } from "../types/restaurant.types";
import { purple, pink, lightPurple } from "../../common/theme/colorScheme";

interface RestaurantCardProps {
  restaurant: RestaurantProfile;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <Box
      borderWidth="3px"
      borderColor={pink}
      borderRadius="xl"
      p={6}
      bg="gray.50"
      boxShadow="lg"
      position="relative"
      overflow="hidden"
      onClick={onClick}
      _hover={{
        transform: "translateY(-8px) scale(1.02)",
        boxShadow: `0 20px 40px ${purple}30`,
        borderColor: purple,
      }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        bgGradient: `linear(to-r, ${purple}, ${pink})`,
      }}
      cursor="pointer"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={purple}
        mb={2}
        letterSpacing="tight"
      >
        {restaurant.restaurantName}
      </Text>
      {restaurant.openingHours && (
        <Text fontSize="sm" color="gray.600">
          🕒 {restaurant.openingHours}
        </Text>
      )}
      <Text fontSize="sm" color={lightPurple} mt={2}>
        {restaurant.menu.items.length} items
      </Text>
    </Box>
  );
}
