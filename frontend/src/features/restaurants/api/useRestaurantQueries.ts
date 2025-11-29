import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as restaurantApi from './restaurantApi';
import type {
  RestaurantUser,
  RestaurantProfile,
  Menu,
  MenuItem,
  UpdateRestaurantProfileRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from '../types/restaurant.types';

// Query Keys
export const restaurantKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantKeys.all, 'list'] as const,
  list: () => [...restaurantKeys.lists()] as const,
  details: () => [...restaurantKeys.all, 'detail'] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  menu: (id: string) => [...restaurantKeys.all, 'menu', id] as const,
};

export const useGetAllRestaurants = () => {
  return useQuery<RestaurantUser[], Error>({
    queryKey: restaurantKeys.list(),
    queryFn: restaurantApi.getAllRestaurants,
  });
};

export const useGetRestaurantProfile = (restaurantId: string) => {
  return useQuery<RestaurantProfile, Error>({
    queryKey: restaurantKeys.detail(restaurantId),
    queryFn: () => restaurantApi.getRestaurantProfile(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useUpdateRestaurantProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RestaurantProfile,
    Error,
    { restaurantId: string; data: UpdateRestaurantProfileRequest }
  >({
    mutationFn: ({ restaurantId, data }) =>
      restaurantApi.updateRestaurantProfile(restaurantId, data),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(restaurantId) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.list() });
    },
  });
};

export const useGetMenu = (restaurantId: string) => {
  return useQuery<Menu, Error>({
    queryKey: restaurantKeys.menu(restaurantId),
    queryFn: () => restaurantApi.getMenu(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useAddMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation<MenuItem, Error, { restaurantId: string; data: CreateMenuItemRequest }>({
    mutationFn: ({ restaurantId, data }) => restaurantApi.addMenuItem(restaurantId, data),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menu(restaurantId) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(restaurantId) });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    MenuItem,
    Error,
    { restaurantId: string; menuItemId: string; data: UpdateMenuItemRequest }
  >({
    mutationFn: ({ restaurantId, menuItemId, data }) =>
      restaurantApi.updateMenuItem(restaurantId, menuItemId, data),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menu(restaurantId) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(restaurantId) });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { restaurantId: string; menuItemId: string }>({
    mutationFn: ({ restaurantId, menuItemId }) =>
      restaurantApi.deleteMenuItem(restaurantId, menuItemId),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menu(restaurantId) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(restaurantId) });
    },
  });
};
