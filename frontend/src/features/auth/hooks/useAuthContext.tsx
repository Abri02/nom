import {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type {
  AuthContextType,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth.types";
import { useLoginMutation, useRegisterMutation } from "../api/useAuthMutations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          const storedUser: User = JSON.parse(userStr);
          setIsLoggedIn(true);
          setUser(storedUser);
        }
      } catch (err) {
        setIsLoggedIn(false);
        console.error("Auth failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async ({
    name,
    email,
    password,
    phoneNumber,
    zipCode,
    city,
    street,
    streetNumber,
    role,
    restaurantProfile,
  }: RegisterRequest) => {
    setError(null);

    try {
      const response = await registerMutation.mutateAsync({
        email,
        password,
        phoneNumber,
        zipCode,
        city,
        street,
        streetNumber,
        role,
        name,
        restaurantProfile,
      });

      console.log("Registration response:", response);

      // Check if response exists
      if (!response) {
        throw new Error("Registration failed - no response");
      }

      // Registration successful - user should now login
      console.log("Registration successful, please login");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async ({ email, password }: LoginRequest) => {
    setError(null);

    try {
      const response: AuthResponse = await loginMutation.mutateAsync({
        email,
        password,
      });

      console.log("Login response:", response);

      // Check if response exists
      if (!response) {
        throw new Error("Login failed - no response");
      }

      // Warn if no token is provided
      if (!response.token) {
        console.warn("No token received in login response");
      }

      const loggedInUser: User = {
        id: response.id,
        email: response.email || email,
        role: response.role,
        name: response.name
      };

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        console.log("Token stored in localStorage");

        const storedToken = localStorage.getItem("authToken");
        console.log(
          "Verification - Token retrieved:",
          storedToken ? `${storedToken.substring(0, 20)}...` : "null"
        );
        console.log(
          "Verification - Token matches:",
          storedToken === response.token
        );
      } else {
        console.warn("No token to store - authentication may not work");
      }

      localStorage.setItem("user", JSON.stringify(loggedInUser));

      setUser(loggedInUser);
      setIsLoggedIn(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setError(null);
  }, []);

  const clearError = () => {
    setError(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated: !!user,
      isLoading:
        isLoading || loginMutation.isPending || registerMutation.isPending,
      user,
      error:
        error ||
        loginMutation.error?.message ||
        registerMutation.error?.message ||
        null,
      register,
      login,
      logout,
      clearError,
      isLoggedIn,
    }),
    [
      user,
      isLoading,
      error,
      loginMutation,
      registerMutation,
      login,
      logout,
      register,
      isLoggedIn,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
