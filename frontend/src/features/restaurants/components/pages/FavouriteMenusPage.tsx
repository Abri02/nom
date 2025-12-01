
import { Box, SimpleGrid, Text, Heading } from "@chakra-ui/react";
import { useGetFavouriteMenuItems } from "../../api/useRestaurantQueries";
import { MenuItemCard } from "../MenuItemCard";
import { yellow } from "../../../common/theme/colorScheme";
import type { MenuItem } from "../../types/restaurant.types";

export function FavouriteMenusPage() {
  const { 
    data: favouriteMenuItems, 
    isLoading, 
    error 
  } = useGetFavouriteMenuItems();


  if (isLoading) {
    return <Box p={6}>Loading your favourite menu items...</Box>;
  }

  if (error) {
    return <Box p={6}>Error loading favourites: {error.message}</Box>;
  }

  if (!favouriteMenuItems || favouriteMenuItems.length === 0) {
    return (
      <Box p={6}>
        <Heading size="lg" color={yellow} mb={4}>
          Your Favourite Menu Items
        </Heading>
        <Text color="gray.600">
          You haven't added any favourite menu items yet. Click the heart icon
          on any menu item to add it to your favourites!
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6} flex="1">
      <Heading size="lg" color={yellow} mb={6}>
        Your Favourite Menu Items
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {favouriteMenuItems.map((menuItem: MenuItem) => (
          <MenuItemCard
            key={menuItem.id}
            menuItem={menuItem}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}