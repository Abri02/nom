import { Box, SimpleGrid } from "@chakra-ui/react";
import { mockRestaurants } from "../../data/mockRestaurants";
import { RestaurantCard } from "../RestaurantCard";
import { useNavigate } from "react-router-dom";
import type { RestaurantProfile } from "../../types/restaurant.types";
import { useRestaurant } from "../../hooks/useRestaurantContext";

export function RestaurantPage() {
  //TODO: Add real api call
  const restaurants = mockRestaurants;
  const navigate = useNavigate();

  const { setSelectedRestaurant } = useRestaurant();
  const onCardClick = (id: string, restaurant: RestaurantProfile) => {
    setSelectedRestaurant(restaurant);
    navigate(`/restaurant/${id}`);
  };

  return (
    <Box p={6} flex="1">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.restaurantName}
            restaurant={restaurant}
            onClick={() => onCardClick(index.toString(), restaurant)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
