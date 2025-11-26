import { Box, Container, Text, Flex } from "@chakra-ui/react";
import { purple, pink, yellow } from "../../common/theme/colorScheme";

export function Footer() {
  return (
    <Box
      as="footer"
      bg={purple}
      borderTop="2px solid"
      borderColor={pink}
      py="1.5rem"
      mt="auto"
    >
      <Container maxW="7xl">
        <Flex justify="center" align="center" direction="column" gap="0.5rem">
          <Text fontSize="sm" color="white" fontWeight="600">
            Szoftverarchitektúrák házi feladat
          </Text>
          <Text fontSize="sm" color={yellow} fontWeight="500">
            Étel rendelés
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
