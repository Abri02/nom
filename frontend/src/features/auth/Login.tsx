import {
  Field,
  Box,
  Container,
  Text,
  Link,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { User, Lock } from "lucide-react";
import { purple, pink, yellow } from "../common/theme/colorScheme";
import { NomButtons } from "../common/components/NomButton";
import { NomInputs } from "../common/components/NomInput";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = handleSubmit((data: LoginFormInputs) => {
    const stored = localStorage.getItem(data.email);
    const userData = stored
      ? (JSON.parse(stored) as { name?: string; password?: string })
      : null;
    if (userData) {
      if (userData.password === data.password) {
        console.log(userData.name + " You Are Successfully Logged In");
      } else {
        console.log("Email or Password is not matching with our record");
      }
    } else {
      console.log("Email or Password is not matching with our record");
    }
  });

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.900">
      <Container maxW="sm" position="relative" zIndex={1}>
      <VStack gap="2rem" align="stretch">

        {/* Login Card */}
        <Box
          bg={purple}
          borderRadius="2xl"
          shadow="0 20px 60px rgba(69, 6, 147, 0.15)"
          p="2.5rem"
          border="1px solid"
          borderColor={`${purple}15`}
          backdropFilter="blur(10px)"
        >
            <Box display="flex" justifyContent="center" mb="1rem">
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
        

          <form onSubmit={onSubmit}>
            <VStack gap="1.5rem" align="stretch">
              
              <Field.Root invalid={!!errors.email}>
                <Field.Label
                  fontWeight="700"
                  color={yellow}
                  fontSize="sm"
                >
                  Email cím
                </Field.Label>
                <NomInputs
                  {...register("email", {
                    required: "Az email cím kötelező",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Érvénytelen email cím",
                    },
                  })}
                  type="email"
                  placeholder="pelda@example.com"
                  startElement={<User size={20} />}
                  isInvalid={!!errors.email}
                
                />
                {errors.email && (
                  <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                    {errors.email.message}
                  </Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.password}>
                <Field.Label
                  fontWeight="700"
                  color={yellow}
                  fontSize="sm"
                >
                  Jelszó
                </Field.Label>
                <NomInputs
                  {...register("password", {
                    required: "A jelszó kötelező",
                    minLength: {
                      value: 6,
                      message: "A jelszó legalább 6 karakter hosszú",
                    },
                  })}
                  type="password"
                  placeholder="••••••••"
                  startElement={<Lock size={20} />}
                  isInvalid={!!errors.password}
                />
                {errors.password && (
                  <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                    {errors.password.message}
                  </Field.ErrorText>
                )}
              </Field.Root>

              <NomButtons
                title="Bejelentkezés"
                type="submit"
                w="full"
                h="2.75rem"
                fontSize="md"
                fontWeight="700"
                borderRadius="lg"
              />
            </VStack>
          </form>

        
          <Box textAlign="center">
            <Text fontSize="sm" color="white">
              Még nem regisztráltál?{" "}
              <Link
                href="/register"
                color={yellow}
                fontWeight="600"
                _hover={{ textDecoration: "underline" }}
              >
                Regisztrálj most
              </Link>
            </Text>
          </Box>
        </Box>
      </VStack>
      </Container>
    </Box>
  );
}
