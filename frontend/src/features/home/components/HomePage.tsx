import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAuth } from "../../auth/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Truck,
  Clock,
  Star,
  MapPin,
  CreditCard,
  Heart,
  Users,
} from "lucide-react";
import { purple, pink, yellow } from "../../common/theme/colorScheme";
import { NomButtons } from "../../common/components/NomButton";

export function HomePage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const features = [
    {
      icon: Utensils,
      title: "Széles étterem választék",
      description:
        "Több száz étterem közül választhatsz kedvenc ételeid megrendeléséhez",
    },
    {
      icon: Clock,
      title: "Gyors kiszállítás",
      description: "30-45 perc alatt házhoz szállítjuk a friss, meleg ételeket",
    },
    {
      icon: Star,
      title: "Minőségi szolgáltatás",
      description: "Csak a legjobb értékelésű éttermekkel dolgozunk együtt",
    },
    {
      icon: CreditCard,
      title: "Biztonságos fizetés",
      description: "Kártyával vagy készpénzzel is fizethetsz kényelmesen",
    },
  ];

  const userTypeFeatures = {
    CUSTOMER: {
      title: "Vásárlóként",
      features: [
        "Böngészd a kedvenc éttermeid kínálatát",
        "Kövesd nyomon rendeléseid állapotát",
        "Értékeld az ételeket és éttermeket",
        "Gyűjtsd a kedvenceid listáját",
      ],
    },
    RESTAURANT: {
      title: "Étteremként",
      features: [
        "Kezeld menüdet és áraid egyszerűen",
        "Fogadd és teljesítsd a rendeléseket",
        "Kövesd nyomon bevételeidet",
        "Építsd ki vevőkörődet",
      ],
    },
    COURIER: {
      title: "Futárként",
      features: [
        "Válassz rugalmas munkaidőt",
        "Optimalizált útvonalak",
        "Azonnali kifizetések",
        "Támogató közösség",
      ],
    },
  };

  const currentUserFeatures = user?.role
    ? userTypeFeatures[user.role as keyof typeof userTypeFeatures]
    : null;

  return (
    <Box bg="gray.900" minH="100vh">
      <Box
        bgGradient={`linear(to-br, ${purple}, ${pink})`}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl" py={isMobile ? "4rem" : "6rem"}>
          <VStack gap="2rem" textAlign="center" color="white">
            <Text
              fontSize={isMobile ? "3xl" : "6xl"}
              fontWeight="900"
              color={`${pink}`}
            >
              NOM
            </Text>

            <Text
              fontSize={isMobile ? "lg" : "2xl"}
              fontWeight="600"
              maxW="2xl"
              color="whiteAlpha.900"
            >
              A legjobb ételek egy kattintásra tőled
            </Text>

            <Text
              fontSize={isMobile ? "md" : "lg"}
              maxW="3xl"
              color="whiteAlpha.800"
              lineHeight="1.6"
            >
              Fedezd fel a város legjobb éttermeit, rendeld meg kedvenc
              ételeidet, és élvezd a gyors, megbízható házhoz szállítást. A
              NOM-mal az ínycsiklandó élmények mindig elérhető közelségben
              vannak.
            </Text>

            {isLoggedIn ? (
              <VStack gap="1rem">
                <Text fontSize="lg" color={yellow} fontWeight="600">
                  Üdvözlünk vissza, {user?.name}! 👋
                </Text>
                <HStack gap="1rem">
                  <NomButtons
                    title="Étteremek böngészése"
                    onClick={() => navigate("/restaurants")}
                  ></NomButtons>
                  <NomButtons
                    title="Rendeléseim"
                    colorScheme="outline"
                    onClick={() => navigate("/orders")}
                  ></NomButtons>
                </HStack>
              </VStack>
            ) : (
              <HStack gap="1rem">
                <NomButtons
                  title="Regisztráció"
                  onClick={() => navigate("/register")}
                ></NomButtons>
                <NomButtons
                  title="Bejelentkezés"
                  colorScheme="outline"
                  onClick={() => navigate("/login")}
                ></NomButtons>
              </HStack>
            )}
          </VStack>
        </Container>
      </Box>

      <Container maxW="7xl" py="4rem">
        <VStack gap="3rem">
          <VStack gap="1rem" textAlign="center">
            <Text
              fontSize={isMobile ? "2xl" : "4xl"}
              fontWeight="800"
              color="white"
            >
              Miért válaszd a NOM-ot?
            </Text>
            <Text fontSize="lg" color="gray.400" maxW="2xl">
              Több mint egy egyszerű ételrendelő platform - a teljes
              gasztronómiai élmény
            </Text>
          </VStack>

          <Grid
            templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
            gap="2rem"
            w="full"
          >
            {features.map((feature, index) => (
              <GridItem key={index}>
                <Box
                  bg="gray.800"
                  p="2rem"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.700"
                  _hover={{
                    borderColor: purple,
                    transform: "translateY(-4px)",
                  }}
                  transition="all 0.3s"
                  h="full"
                >
                  <VStack gap="1rem" align="start">
                    <Box
                      bg={purple}
                      p="0.75rem"
                      borderRadius="lg"
                      color={yellow}
                    >
                      <Icon as={feature.icon} boxSize="1.5rem" />
                    </Box>
                    <Text fontSize="xl" fontWeight="700" color="white">
                      {feature.title}
                    </Text>
                    <Text color="gray.400" lineHeight="1.6">
                      {feature.description}
                    </Text>
                  </VStack>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>

      {isLoggedIn && currentUserFeatures && (
        <Box bg="gray.800">
          <Container maxW="7xl" py="4rem">
            <VStack gap="2rem">
              <Text
                fontSize={isMobile ? "2xl" : "3xl"}
                fontWeight="800"
                color="white"
                textAlign="center"
              >
                {currentUserFeatures.title}
              </Text>

              <Grid
                templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                gap="1rem"
                maxW="4xl"
              >
                {currentUserFeatures.features.map((feature, index) => (
                  <GridItem key={index}>
                    <HStack gap="0.75rem" align="start">
                      <Box
                        bg={yellow}
                        borderRadius="full"
                        p="0.25rem"
                        mt="0.125rem"
                        flexShrink={0}
                      >
                        <Box w="0.5rem" h="0.5rem" />
                      </Box>
                      <Text color="gray.300" fontSize="md">
                        {feature}
                      </Text>
                    </HStack>
                  </GridItem>
                ))}
              </Grid>
            </VStack>
          </Container>
        </Box>
      )}

      {/* Stats Section */}
      <Container maxW="7xl" py="4rem">
        <Grid
          templateColumns={isMobile ? "1fr" : "repeat(3, 1fr)"}
          gap="2rem"
          textAlign="center"
        >
          <VStack gap="0.5rem">
            <Text fontSize="4xl" fontWeight="900" color={yellow}>
              500+
            </Text>
            <Text color="gray.400" fontWeight="600">
              Partner étterem
            </Text>
          </VStack>
          <VStack gap="0.5rem">
            <Text fontSize="4xl" fontWeight="900" color={pink}>
              50K+
            </Text>
            <Text color="gray.400" fontWeight="600">
              Elégedett vásárló
            </Text>
          </VStack>
          <VStack gap="0.5rem">
            <Text fontSize="4xl" fontWeight="900" color={purple}>
              1M+
            </Text>
            <Text color="gray.400" fontWeight="600">
              Teljesített rendelés
            </Text>
          </VStack>
        </Grid>
      </Container>

      {/* CTA Section */}
      {!isLoggedIn && (
        <Box bg={purple} py="4rem">
          <Container maxW="4xl">
            <VStack gap="2rem" textAlign="center" color="white">
              <Text fontSize={isMobile ? "2xl" : "3xl"} fontWeight="800">
                Készen állsz a finom élményekre?
              </Text>
              <Text fontSize="lg" color="whiteAlpha.800" maxW="2xl">
                Csatlakozz több ezer elégedett felhasználónkhoz, és fedezd fel a
                város legjobb ízeit a saját otthonod kényelméből.
              </Text>
              <NomButtons
                title="Kezdjük el! 🚀"
                onClick={() => navigate("/register")}
                py="1.5rem"
                px="3rem"
                fontSize="lg"
              ></NomButtons>
            </VStack>
          </Container>
        </Box>
      )}
    </Box>
  );
}
