import { apiClient } from "../../../lib/apiClient";
import type {
    GetUserProfileResponse,
    UpdateUserProfileRequest,
    UpdateUserProfileResponse,
} from "./profileapi.types.ts";


export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const response = await apiClient.get<GetUserProfileResponse>(
    "/api/users/profile");  
  return response.data;
}
export const updateUserProfile = async (
    request: UpdateUserProfileRequest
    ): Promise<UpdateUserProfileResponse> => {
    const response = await apiClient.post<UpdateUserProfileResponse>(
    "/api/users/profile",
    request
  );
  return response.data;
}