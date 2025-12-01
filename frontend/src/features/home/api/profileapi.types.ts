type UpdateUserProfileResponse = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  street: string;
  streetNumber: string;
  description?: string;
  city: string;
  zipCode: string;
};

type UpdateUserProfileRequest = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  street: string;
  streetNumber: string;
  description?: string;
  city: string;
  zipCode: string;
};

type GetUserProfileResponse = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
    city: string;
    street: string;
    streetNumber: string;
    role: "CUSTOMER" | "RESTAURANT" | "COURIER" | "ADMIN" | "UNKNOWN";
    description?: string;
    isSuspended: boolean;
    favouriteRestaurants: string[];
    createdAt: string;
}

type GetUserProfileRequest = {
    userId: string;
}

export type {
    GetUserProfileResponse,
    GetUserProfileRequest,
    UpdateUserProfileRequest,
    UpdateUserProfileResponse,
};