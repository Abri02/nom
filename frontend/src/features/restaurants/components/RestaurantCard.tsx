import { Box, Text } from "@chakra-ui/react";
import type { RestaurantUser } from "../types/restaurant.types";
import { purple, pink, lightPurple, yellow } from "../../common/theme/colorScheme";
import { useAddFavouriteRestaurant, useGetFavouriteRestaurantsById, useRemoveFavouriteRestaurant } from "../api/useRestaurantQueries";


interface RestaurantCardProps {
  restaurant: RestaurantUser;
  onClick: () => void;
  isFavourite?: boolean;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const addFavourite = useAddFavouriteRestaurant();
  const removeFavourite = useRemoveFavouriteRestaurant();
  const getFavById = useGetFavouriteRestaurantsById(restaurant.id); 
  
  const isFavourite = getFavById.data === true;
  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavourite) {
      removeFavourite.mutate({ restaurantId: restaurant.id });
      getFavById.refetch();
    } else {
      addFavourite.mutate({ restaurantId: restaurant.id });
      getFavById.refetch();
    }
  };

  return (
    <Box
      borderWidth="3px"
      borderColor={pink}
      borderRadius="xl"
      p={6}
      bg={`${purple}90`}
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
      <Box
        as="button"
        aria-label="Toggle favourite"
        
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
        opacity={addFavourite.isPending || removeFavourite.isPending ? 0.5 : 1}
      >
        {isFavourite ? "❤️" : "🤍"} 
      </Box>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={yellow}
        mb={2}
        letterSpacing="tight"
      >
        {restaurant.name}
      </Text>
      {restaurant.description && (
        <Text fontSize="sm" color="gray.600">
          🕒 {restaurant.description}
        </Text>
      )}
      <Text fontSize="sm" color={yellow} mt={2}>
        📧 {restaurant.email}
      </Text>
    </Box>
  );
}
