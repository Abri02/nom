import { apiClient } from "../../../lib/apiClient";
import type {
  RestaurantUser,
  RestaurantProfile,
  Menu,
  MenuItem,
  UpdateRestaurantProfileRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  AddFavouriteRestaurantRequest,
  GetFavouriteRestaurantRequest,
} from "../types/restaurant.types";

export const getAllRestaurants = async (): Promise<RestaurantUser[]> => {
  const { data } = await apiClient.get<RestaurantUser[]>(
    "/api/restaurants/restaurants"
  );
  return data;
};

export const getRestaurantProfile = async (
  restaurantId: string
): Promise<RestaurantProfile> => {
  const { data } = await apiClient.get<RestaurantProfile>(
    `/api/restaurants/${restaurantId}/profile`
  );
  return data;
};

export const updateRestaurantProfile = async (
  restaurantId: string,
  request: UpdateRestaurantProfileRequest
): Promise<RestaurantProfile> => {
  const { data } = await apiClient.put<RestaurantProfile>(
    `/api/restaurants/${restaurantId}/profile`,
    request
  );
  return data;
};

export const getMenu = async (restaurantId: string): Promise<Menu> => {
  const { data } = await apiClient.get<Menu>(
    `/api/restaurants/${restaurantId}/menu`
  );
  return data;
};

export const addMenuItem = async (
  restaurantId: string,
  request: CreateMenuItemRequest
): Promise<MenuItem> => {
  const { data } = await apiClient.post<MenuItem>(
    `/api/restaurants/${restaurantId}/menu/items`,
    request
  );
  return data;
};

export const updateMenuItem = async (
  restaurantId: string,
  menuItemId: string,
  request: UpdateMenuItemRequest
): Promise<MenuItem> => {
  const { data } = await apiClient.put<MenuItem>(
    `/api/restaurants/${restaurantId}/menu/items/${menuItemId}`,
    request
  );
  return data;
};

export const deleteMenuItem = async (
  restaurantId: string,
  menuItemId: string
): Promise<void> => {
  await apiClient.delete(
    `/api/restaurants/${restaurantId}/menu/items/${menuItemId}`
  );
};

export const getFavouriteRestaurantById = async (
  restaurantId: String
): Promise<boolean> => {
  const {data} = await apiClient.get<boolean>("/api/users/favourites", { params: restaurantId });
  return data;
};

export const getFavouriteRestaurants = async (): Promise<RestaurantProfile[]> => {
  const { data } = await apiClient.get<RestaurantProfile[]>(
    "/api/users/favourites/restaurants"
  );
  return data;
};

export const addFavouriteRestaurant = async (
  request: AddFavouriteRestaurantRequest
): Promise<void> => {
  await apiClient.post("/api/users/favourites", request);
};

export const removeFavouriteRestaurant = async (
  request: AddFavouriteRestaurantRequest
): Promise<void> => {
  await apiClient.delete("/api/users/favourites", { data: request });
};
