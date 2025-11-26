import { Button, Flex, Text } from "@chakra-ui/react";
import { useAuth } from "../../auth/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Flex
      flex="1"
      direction="column"
      align="center"
      justify="center"
      gap="1rem"
      bg="gray.900"
    >
      <Text fontSize="2xl" color="white">
        Logged in as {user?.email}
      </Text>
      <Button onClick={handleLogout} colorScheme="red" size="lg" px="2rem">
        Logout
      </Button>
    </Flex>
  );
}
