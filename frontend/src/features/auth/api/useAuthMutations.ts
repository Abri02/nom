import { useMutation } from "@tanstack/react-query";
import * as authApi from "./authApi";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

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
