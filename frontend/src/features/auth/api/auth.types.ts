export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
}

export interface AuthResponse {
  token: string | null;
  email: string | null;
  message: string;
}
