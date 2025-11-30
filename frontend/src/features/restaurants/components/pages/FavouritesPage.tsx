import { Box, SimpleGrid, Text, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useGetFavouriteRestaurants, useGetAllRestaurants } from "../../api/useRestaurantQueries";
import { RestaurantCard } from "../RestaurantCard";
import { useRestaurant } from "../../hooks/useRestaurantContext";
import type { RestaurantUser } from "../../types/restaurant.types";
import { yellow } from "../../../common/theme/colorScheme";

export function FavouritesPage() {
  const navigate = useNavigate();
  const { data: favourites, isLoading: favLoading, error: favError } = useGetFavouriteRestaurants();
  const { data: allRestaurants, isLoading: restLoading } = useGetAllRestaurants();
  const { setSelectedRestaurant } = useRestaurant();

  const isLoading = favLoading || restLoading;
  const error = favError;

  // Match favourites with full restaurant data
  const favouriteRestaurants: RestaurantUser[] = [];
  if (favourites && allRestaurants) {
    favourites.forEach((fav) => {
      const restaurant = allRestaurants.find((r) => r.name === fav.restaurantName);
      if (restaurant) {
        favouriteRestaurants.push(restaurant);
      }
    });
  }

  const onCardClick = (restaurant: RestaurantUser) => {
    const profile = {
      restaurantName: restaurant.name,
      openingHours: restaurant.description,
    };
    setSelectedRestaurant(profile, restaurant.id);
    navigate(`/restaurant/${restaurant.id}`);
  };

  if (isLoading) {
    return <Box p={6}>Loading your favourite restaurants...</Box>;
  }

  if (error) {
    return <Box p={6}>Error loading favourites: {error.message}</Box>;
  }

  if (!favourites || favourites.length === 0) {
    return (
      <Box p={6}>
        <Heading size="lg" color={yellow} mb={4}>
          Your Favourite Restaurants
        </Heading>
        <Text color="gray.600">
          You haven't added any favourite restaurants yet. Click the heart icon
          on any restaurant card to add it to your favourites!
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6} flex="1">
      <Heading size="lg" color={yellow} mb={6}>
        Your Favourite Restaurants
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {favouriteRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => onCardClick(restaurant)}
            isFavourite={true}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
