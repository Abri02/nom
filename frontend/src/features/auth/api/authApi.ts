import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from './auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  const { data } = await authApi.post<AuthResponse>('/api/auth/login', request);
  return data;
};

export const register = async (request: RegisterRequest): Promise<AuthResponse> => {
  const { data } = await authApi.post<AuthResponse>('/api/auth/register', request);
  return data;
};

export default authApi;
