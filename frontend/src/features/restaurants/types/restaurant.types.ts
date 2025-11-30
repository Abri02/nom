export interface RestaurantUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "RESTAURANT" | "CUSTOMER" | "COURIER" | "ADMIN" | "UNKNOWN";
  description?: string;
  isSuspended: boolean;
  createdAt: string;
  image?: string;
}

export interface RestaurantProfile {
  restaurantName: string;
  openingHours?: string;
  menu?: Menu;
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

export interface AddFavouriteRestaurantRequest {
  restaurantId: string;
}
