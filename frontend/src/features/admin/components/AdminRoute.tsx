import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuthContext";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <Center h="100vh">
        <VStack gap={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Access Denied
          </Text>
          <Text>You don't have permission to access this page.</Text>
        </VStack>
      </Center>
    );
  }

  return <>{children}</>;
};
