import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { RestaurantProfile } from "../types/restaurant.types";

interface RestaurantContextType {
  selectedRestaurant: RestaurantProfile | null;
  setSelectedRestaurant: (restaurant: RestaurantProfile | null) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

interface RestaurantProviderProps {
  readonly children: ReactNode;
}

export function RestaurantProvider({ children }: RestaurantProviderProps) {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantProfile | null>(null);

  const value = useMemo(
    () => ({ selectedRestaurant, setSelectedRestaurant }),
    [selectedRestaurant]
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
