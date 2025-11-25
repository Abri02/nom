import { Field, Box, Container, Text, Link, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { User, Lock, Mail, ArrowLeft, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { purple, pink, yellow } from "../../common/theme/colorScheme";
import { NomButtons } from "../../common/components/NomButton";
import { NomInputs } from "../../common/components/NomInput";
import { useAuth } from "../hooks/useAuthContext";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address?: string;
  phoneNumber?: string;
};

interface RegisterFormProps {
  userType: "customer" | "restaurant" | "courier";
}

const userTypeLabels = {
  customer: "Vásárló",
  restaurant: "Étterem",
  courier: "Futár",
};

export function RegisterForm({ userType }: RegisterFormProps) {
  const navigate = useNavigate();
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const password = watch("password");

  const {
    register: authRegister,
    isLoading,
    error: authError,
    isLoggedIn,
  } = useAuth();

  if (isLoggedIn) navigate("/home");

  const onSubmit = handleSubmit(async (data: RegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      console.log("A jelszavak nem egyeznek");
      return;
    }

    try {
      const roleMap = {
        customer: "CUSTOMER",
        restaurant: "RESTAURANT",
        courier: "COURIER",
      };

      await authRegister({
        name: data.name,
        email: data.email,
        password: data.password,
        //TODO: ADD PHONE NUMBER PROPERLY
        phoneNumber: data.phoneNumber || "+3690512553",
        role: roleMap[userType],
      });

      console.log("Sikeres regisztráció!");
      navigate("/");
    } catch (err) {
      console.error("Regisztráció sikertelen:", err);
    }
  });

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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb="1rem"
            >
              <Box
                cursor="pointer"
                onClick={() => navigate("/register")}
                p="0.5rem"
                borderRadius="md"
                transition="all 0.2s"
                _hover={{ bg: `${pink}20` }}
              >
                <ArrowLeft size={20} color={yellow} />
              </Box>
              <Box
                bg={pink}
                backgroundClip="text"
                fontSize="3xl"
                fontWeight="900"
                color="transparent"
              >
                NOM
              </Box>
              <Box w="36px" />
            </Box>

            <Text
              textAlign="center"
              color={yellow}
              fontSize="sm"
              fontWeight="600"
              mb="1rem"
            >
              {userTypeLabels[userType]} regisztráció
            </Text>

            <form onSubmit={onSubmit}>
              <VStack gap="1.5rem" align="stretch">
                {authError && (
                  <Box
                    bg="red.500"
                    color="white"
                    p="0.75rem"
                    borderRadius="md"
                    fontSize="sm"
                  >
                    {authError}
                  </Box>
                )}

                <Field.Root invalid={!!errors.name}>
                  <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                    Név
                  </Field.Label>
                  <NomInputs
                    {...formRegister("name", {
                      required: "A név kötelező",
                      minLength: {
                        value: 2,
                        message: "A név legalább 2 karakter hosszú",
                      },
                    })}
                    type="text"
                    placeholder="Teljes név"
                    startElement={<User size={20} />}
                    isInvalid={!!errors.name}
                  />
                  {errors.name && (
                    <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                      {errors.name.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.email}>
                  <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                    Email cím
                  </Field.Label>
                  <NomInputs
                    {...formRegister("email", {
                      required: "Az email cím kötelező",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Érvénytelen email cím",
                      },
                    })}
                    type="email"
                    placeholder="pelda@example.com"
                    startElement={<Mail size={20} />}
                    isInvalid={!!errors.email}
                  />
                  {errors.email && (
                    <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                      {errors.email.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                {userType === "restaurant" && (
                  <Field.Root invalid={!!errors.address}>
                    <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                      Cím
                    </Field.Label>
                    <NomInputs
                      {...formRegister("address", {
                        required: "A cím kötelező",
                        minLength: {
                          value: 5,
                          message: "A cím legalább 5 karakter hosszú",
                        },
                      })}
                      type="text"
                      placeholder="Utca, város, irányítószám"
                      startElement={<MapPin size={20} />}
                      isInvalid={!!errors.address}
                    />
                    {errors.address && (
                      <Field.ErrorText
                        fontSize="sm"
                        color="red.500"
                        mt="0.5rem"
                      >
                        {errors.address.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>
                )}

                {userType === "courier" && (
                  <Field.Root invalid={!!errors.phoneNumber}>
                    <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                      Telefonszám
                    </Field.Label>
                    <NomInputs
                      {...formRegister("phoneNumber", {
                        required: "A telefonszám kötelező",
                        pattern: {
                          value: /^[0-9+\-() ]{10,}$/,
                          message: "Érvénytelen telefonszám",
                        },
                      })}
                      type="tel"
                      placeholder="+36 70 123 4567"
                      startElement={<Phone size={20} />}
                      isInvalid={!!errors.phoneNumber}
                    />
                    {errors.phoneNumber && (
                      <Field.ErrorText
                        fontSize="sm"
                        color="red.500"
                        mt="0.5rem"
                      >
                        {errors.phoneNumber.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>
                )}

                <Field.Root invalid={!!errors.password}>
                  <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                    Jelszó
                  </Field.Label>
                  <NomInputs
                    {...formRegister("password", {
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

                <Field.Root invalid={!!errors.confirmPassword}>
                  <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                    Jelszó megerősítése
                  </Field.Label>
                  <NomInputs
                    {...formRegister("confirmPassword", {
                      required: "A jelszó megerősítése kötelező",
                      validate: (value) =>
                        value === password || "A jelszavak nem egyeznek",
                    })}
                    type="password"
                    placeholder="••••••••"
                    startElement={<Lock size={20} />}
                    isInvalid={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                      {errors.confirmPassword.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <NomButtons
                  title={isLoading ? "Regisztráció..." : "Regisztráció"}
                  type="submit"
                  w="full"
                  h="2.75rem"
                  fontSize="md"
                  fontWeight="700"
                  borderRadius="lg"
                  disabled={isLoading}
                />
              </VStack>
            </form>

            <Box textAlign="center" mt="1.5rem">
              <Text fontSize="sm" color="white">
                Már regisztráltál?{" "}
                <Link
                  href="/login"
                  color={yellow}
                  fontWeight="600"
                  _hover={{ textDecoration: "underline" }}
                >
                  Bejelentkezés
                </Link>
              </Text>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
