import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const createApiClient = (baseURL: string = API_BASE_URL) => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      console.log(`[API Interceptor] Checking for token...`);
      console.log(`[API Interceptor] Token from localStorage:`, token ? `${token.substring(0, 20)}...` : 'null');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Token attached`);
        console.log(`[API Request] Authorization header:`, config.headers.Authorization.substring(0, 30) + '...');
      } else {
        console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url} - No token found in localStorage`);
        console.warn(`[API Request] localStorage keys:`, Object.keys(localStorage));
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for better error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized - Token might be invalid or expired");
        // Optionally clear auth and redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();
