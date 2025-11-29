import { apiClient } from "../../../lib/apiClient";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>(
    "/api/auth/login",
    request
  );
  return data;
};

export const register = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/api/users", request);
  return data;
};
