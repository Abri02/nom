import { Box, Flex } from "@chakra-ui/react";
import { NavBar } from "./NavBar";
import { Footer } from "../../common/components/Footer";
import { FloatingCartButton } from "../../cart/components/FloatingCartButton";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface NavBarLayoutProps {
  readonly children: ReactNode;
}

const PUBLIC_ROUTES = new Set([
  "/login",
  "/register",
  "/register/customer",
  "/register/restaurant",
  "/register/courier",
]);

export function NavBarLayout({ children }: Readonly<NavBarLayoutProps>) {
  const location = useLocation();
  const showNavBar = !PUBLIC_ROUTES.has(location.pathname);

  return (
    <Flex direction="column" minH="100vh">
      {showNavBar && <NavBar />}
      <Box flex="1" position="relative">
        {children}
        {showNavBar && <FloatingCartButton />}
      </Box>
      {showNavBar && <Footer />}
    </Flex>
  );
}
