import { apiClient } from '../../../lib/apiClient';
import type { LoginRequest, RegisterRequest, AuthResponse } from './auth.types';

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', request);
  return data;
};

export const register = async (request: RegisterRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/register', request);
  return data;
};
