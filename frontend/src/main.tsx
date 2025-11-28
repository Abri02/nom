import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./features/auth/hooks/useAuthContext";
import { RestaurantProvider } from "./features/restaurants/hooks/useRestaurantContext";
import { CartProvider } from "./features/cart/hooks/useCartContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <RestaurantProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </RestaurantProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
