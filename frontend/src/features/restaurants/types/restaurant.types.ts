export interface RestaurantProfile {
  restaurantName: string;
  openingHours?: string;
  menu: Menu;
}

export interface Menu {
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  allergens: string[];
  imageUrl?: string;
}

export interface UpdateRestaurantProfileRequest {
  restaurantName: string;
  openingHours: string;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  allergens?: string[];
  imageUrl?: string;
}

export interface UpdateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  allergens?: string[];
  imageUrl?: string;
}
