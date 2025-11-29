import { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import type { RestaurantProfile } from "../types/restaurant.types";

interface RestaurantContextType {
  selectedRestaurant: RestaurantProfile | null;
  selectedRestaurantId: string | null;
  setSelectedRestaurant: (restaurant: RestaurantProfile | null, restaurantId?: string | null) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

interface RestaurantProviderProps {
  readonly children: ReactNode;
}

export function RestaurantProvider({ children }: RestaurantProviderProps) {
  const [selectedRestaurant, setSelectedRestaurantState] =
    useState<RestaurantProfile | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState<string | null>(null);

  const setSelectedRestaurant = useCallback((
    restaurant: RestaurantProfile | null,
    restaurantId?: string | null
  ) => {
    setSelectedRestaurantState(restaurant);
    setSelectedRestaurantId(restaurantId ?? null);
  }, []);

  const value = useMemo(
    () => ({ selectedRestaurant, selectedRestaurantId, setSelectedRestaurant }),
    [selectedRestaurant, selectedRestaurantId, setSelectedRestaurant]
  );

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
