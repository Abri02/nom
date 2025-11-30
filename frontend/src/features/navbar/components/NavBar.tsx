import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
  Link,
  Button,
  Menu,
} from "@chakra-ui/react";
import { Home, Store, User, LogOut, ChevronDown, ChefHat, Package, ClipboardList, Truck, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuthContext";
import {
  purple,
  pink,
  yellow,
  lightPurple,
} from "../../common/theme/colorScheme";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      as="nav"
      bg={purple}
      borderBottom="2px solid"
      borderColor={pink}
      position="sticky"
      top={0}
      zIndex={1000}
      shadow="0 4px 12px rgba(0, 0, 0, 0.3)"
    >
      <Container maxW="7xl">
        <Flex h="4rem" align="center" justify="space-between">
          {/* Logo */}
          <Text
            fontSize="2xl"
            fontWeight="900"
            bg={pink}
            backgroundClip="text"
            color="transparent"
            cursor="pointer"
            onClick={() => navigate("/home")}
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s"
          >
            NOM
          </Text>

          {/* Navigation Links */}
          <HStack gap="1rem">
            <Link
              onClick={() => navigate("/home")}
              display="flex"
              alignItems="center"
              gap="0.5rem"
              px="1rem"
              py="0.5rem"
              borderRadius="md"
              color={isActive("/home") ? yellow : "white"}
              fontWeight={isActive("/home") ? "700" : "500"}
              bg={isActive("/home") ? `${lightPurple}30` : "transparent"}
              _hover={{
                bg: `${lightPurple}20`,
                color: yellow,
              }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Home size={18} />
              <Text fontSize="sm">Home</Text>
            </Link>

            <Link
              onClick={() => navigate("/restaurants")}
              display="flex"
              alignItems="center"
              gap="0.5rem"
              px="1rem"
              py="0.5rem"
              borderRadius="md"
              color={isActive("/restaurants") ? yellow : "white"}
              fontWeight={isActive("/restaurants") ? "700" : "500"}
              bg={isActive("/restaurants") ? `${lightPurple}30` : "transparent"}
              _hover={{
                bg: `${lightPurple}20`,
                color: yellow,
              }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Store size={18} />
              <Text fontSize="sm">Restaurants</Text>
            </Link>

            {user?.role === "CUSTOMER" && (
              <Link
                onClick={() => navigate("/favourites")}
                display="flex"
                alignItems="center"
                gap="0.5rem"
                px="1rem"
                py="0.5rem"
                borderRadius="md"
                color={isActive("/favourites") ? yellow : "white"}
                fontWeight={isActive("/favourites") ? "700" : "500"}
                bg={isActive("/favourites") ? `${lightPurple}30` : "transparent"}
                _hover={{
                  bg: `${lightPurple}20`,
                  color: yellow,
                }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <Heart size={18} />
                <Text fontSize="sm">Favourites</Text>
              </Link>
            )}

            {user?.role === "CUSTOMER" && (
              <Link
                onClick={() => navigate("/orders")}
                display="flex"
                alignItems="center"
                gap="0.5rem"
                px="1rem"
                py="0.5rem"
                borderRadius="md"
                color={isActive("/orders") ? yellow : "white"}
                fontWeight={isActive("/orders") ? "700" : "500"}
                bg={isActive("/orders") ? `${lightPurple}30` : "transparent"}
                _hover={{
                  bg: `${lightPurple}20`,
                  color: yellow,
                }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <Package size={18} />
                <Text fontSize="sm">My Orders</Text>
              </Link>
            )}

            {user?.role === "RESTAURANT" && (
              <>
                <Link
                  onClick={() => navigate("/my-restaurant")}
                  display="flex"
                  alignItems="center"
                  gap="0.5rem"
                  px="1rem"
                  py="0.5rem"
                  borderRadius="md"
                  color={isActive("/my-restaurant") ? yellow : "white"}
                  fontWeight={isActive("/my-restaurant") ? "700" : "500"}
                  bg={isActive("/my-restaurant") ? `${lightPurple}30` : "transparent"}
                  _hover={{
                    bg: `${lightPurple}20`,
                    color: yellow,
                  }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  <ChefHat size={18} />
                  <Text fontSize="sm">My Restaurant</Text>
                </Link>

                <Link
                  onClick={() => navigate("/manage-orders")}
                  display="flex"
                  alignItems="center"
                  gap="0.5rem"
                  px="1rem"
                  py="0.5rem"
                  borderRadius="md"
                  color={isActive("/manage-orders") ? yellow : "white"}
                  fontWeight={isActive("/manage-orders") ? "700" : "500"}
                  bg={isActive("/manage-orders") ? `${lightPurple}30` : "transparent"}
                  _hover={{
                    bg: `${lightPurple}20`,
                    color: yellow,
                  }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  <ClipboardList size={18} />
                  <Text fontSize="sm">Manage Orders</Text>
                </Link>
              </>
            )}

            {user?.role === "COURIER" && (
              <Link
                onClick={() => navigate("/deliveries")}
                display="flex"
                alignItems="center"
                gap="0.5rem"
                px="1rem"
                py="0.5rem"
                borderRadius="md"
                color={isActive("/deliveries") ? yellow : "white"}
                fontWeight={isActive("/deliveries") ? "700" : "500"}
                bg={isActive("/deliveries") ? `${lightPurple}30` : "transparent"}
                _hover={{
                  bg: `${lightPurple}20`,
                  color: yellow,
                }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <Truck size={18} />
                <Text fontSize="sm">My Deliveries</Text>
              </Link>
            )}
          </HStack>

          <Menu.Root positioning={{ placement: "bottom", gutter: 8 }}>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: `${lightPurple}20` }}
                px="1rem"
                py="0.5rem"
                h="3rem"
              >
                <HStack gap="0.5rem">
                  <Flex
                    w="2rem"
                    h="2rem"
                    borderRadius="full"
                    bg={pink}
                    align="center"
                    justify="center"
                  >
                    <User size={16} color="white" />
                  </Flex>
                  <Box textAlign="left">
                    <Text fontSize="sm" fontWeight="600" color={yellow}>
                      {user?.email?.split("@")[0]}
                    </Text>
                    <Text fontSize="xs" color="gray.300">
                      {user?.role || "User"}
                    </Text>
                  </Box>
                  <ChevronDown size={16} />
                </HStack>
              </Button>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content
                bg={purple}
                borderColor={pink}
                borderWidth="2px"
                shadow="0 8px 24px rgba(0, 0, 0, 0.4)"
                minW="200px"
              >
                <Menu.Item
                  value="profile"
                  onClick={() => navigate("/profile")}
                  bg="transparent"
                  color="white"
                  _hover={{ bg: `${lightPurple}20`, color: yellow }}
                  cursor="pointer"
                >
                  <User size={16} />
                  <Text ml="0.5rem">Profile</Text>
                </Menu.Item>

                <Menu.Item
                  value="logout"
                  onClick={handleLogout}
                  bg="transparent"
                  color="white"
                  _hover={{ bg: `${pink}20`, color: pink }}
                  cursor="pointer"
                >
                  <LogOut size={16} />
                  <Text ml="0.5rem">Logout</Text>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Flex>
      </Container>
    </Box>
  );
}
