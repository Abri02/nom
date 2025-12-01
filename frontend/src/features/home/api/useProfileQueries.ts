import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetUserProfileResponse, UpdateUserProfileRequest, UpdateUserProfileResponse } from "./profileapi.types";
import * as profileApi from "./profileApi";

export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};

export const useGetUserProfile = () => {
  return useQuery<GetUserProfileResponse, Error>({
    queryKey: profileKeys.detail(),
    queryFn: profileApi.getUserProfile,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserProfileResponse, Error, UpdateUserProfileRequest>({
    mutationFn: (request) => profileApi.updateUserProfile(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
  });
};