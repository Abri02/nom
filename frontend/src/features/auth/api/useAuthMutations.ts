import { useMutation } from '@tanstack/react-query';
import * as authApi from './authApi';
import type { LoginRequest, RegisterRequest, AuthResponse } from './auth.types';

export const useLoginMutation = () => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
  });
};

export const useRegisterMutation = () => {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: authApi.register,
  });
};
