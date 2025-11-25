import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { User, Store, Bike } from "lucide-react";
import { purple, pink, yellow, lightPurple } from "../common/theme/colorScheme";

export function RegisterTypeSelection() {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: "customer",
      label: "Vásárló",
      description: "Ételeket rendelni szeretnék",
      icon: User,
      path: "/register/customer",
    },
    {
      id: "restaurant",
      label: "Étterem",
      description: "Ételeimet szeretném értékesíteni",
      icon: Store,
      path: "/register/restaurant",
    },
    {
      id: "courier",
      label: "Futár",
      description: "Ételeket szeretnék szállítani",
      icon: Bike,
      path: "/register/courier",
    },
  ];

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.900"
    >
      <Container maxW="sm" position="relative" zIndex={1}>
        <VStack gap="2rem" align="stretch">
          <Box
            bg={purple}
            borderRadius="2xl"
            shadow="0 20px 60px rgba(69, 6, 147, 0.15)"
            p="2.5rem"
            border="1px solid"
            borderColor={`${purple}15`}
            backdropFilter="blur(10px)"
          >
            <Box display="flex" justifyContent="center" mb="1.5rem">
              <Box
                bg={pink}
                backgroundClip="text"
                fontSize="3xl"
                fontWeight="900"
                color="transparent"
              >
                NOM
              </Box>
            </Box>

            <Text
              textAlign="center"
              color={yellow}
              fontSize="lg"
              fontWeight="600"
              mb="0.5rem"
            >
              Választ egy fiók típust
            </Text>
            <Text textAlign="center" color="white" fontSize="sm" opacity={0.8}>
              Milyen szerepben szeretnél regisztrálni?
            </Text>
          </Box>

          <VStack gap="1rem" align="stretch">
            {userTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Box
                  key={type.id}
                  bg="transparent"
                  border="2px solid"
                  borderColor={yellow}
                  borderRadius="xl"
                  p="1.5rem"
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{
                    bg: `${pink}15`,
                    borderColor: pink,
                    transform: "translateY(-2px)",
                    boxShadow: `0 10px 30px ${pink}30`,
                  }}
                  onClick={() => navigate(type.path)}
                >
                  <VStack align="start" gap="0.5rem">
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box
                        p="0.75rem"
                        bg={`${lightPurple}30`}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconComponent size={24} color={pink} />
                      </Box>
                      <Box>
                        <Text color={yellow} fontWeight="700" fontSize="md">
                          {type.label}
                        </Text>
                        <Text color="white" fontSize="xs" opacity={0.7}>
                          {type.description}
                        </Text>
                      </Box>
                    </Box>
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
