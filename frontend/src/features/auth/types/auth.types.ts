export interface User {
  id?: string;
  email: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

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
  role: UserType
}

type UserType = "CUSTOMER" | "RESTAURANT" | "COURIER" | "ADMIN" | "UNKNOWN"


export interface AuthContextType extends AuthState {
  login: (loginRequest: LoginRequest) => Promise<void>;
  register: (registerRequest: RegisterRequest) => Promise<void>;
  isLoggedIn: boolean;
  logout: () => void;
  clearError: () => void;
}
