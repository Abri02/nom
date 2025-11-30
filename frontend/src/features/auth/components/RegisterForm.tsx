import { Field, Box, Container, Text, Link, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { User, Lock, Mail, ArrowLeft, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { purple, pink, yellow } from "../../common/theme/colorScheme";
import { NomButtons } from "../../common/components/NomButton";
import { NomInputs } from "../../common/components/NomInput";
import { useAuth } from "../hooks/useAuthContext";
import { toaster } from "../../../components/ui/toaster";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
  startTime?: string;
  endTime?: string;
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
      toaster.create({
        title: "Hiba",
        description: "A jelszavak nem egyeznek",
        type: "error",
        duration: 3000,
      });
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
        phoneNumber: data.phoneNumber,
        street: data.street,
        streetNumber: data.streetNumber,
        city: data.city,
        zipCode: data.zipCode,
        role: roleMap[userType],
        ...(roleMap[userType] === "RESTAURANT" &&
          data.startTime &&
          data.endTime && {
            restaurantProfile: {
              restaurantName: data.name,
              openingHours: `${data.startTime} - ${data.endTime}`,
            },
          }),
      });

      toaster.create({
        title: "Sikeres regisztráció!",
        description: "Most már bejelentkezhetsz a fiókodba.",
        type: "success",
        duration: 3000,
      });

      navigate("/login");
    } catch (err) {
      toaster.create({
        title: "Regisztráció sikertelen",
        description:
          err instanceof Error ? err.message : "Kérjük, próbáld újra később",
        type: "error",
        duration: 5000,
      });
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
                    <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                      {errors.phoneNumber.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.street}>
                  <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                    Utca
                  </Field.Label>
                  <NomInputs
                    {...formRegister("street", {
                      required: "Az utca kötelező",
                    })}
                    type="text"
                    placeholder="Fő utca"
                    startElement={<MapPin size={20} />}
                    isInvalid={!!errors.street}
                  />
                  {errors.street && (
                    <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                      {errors.street.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.streetNumber}>
                  <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                    Házszám
                  </Field.Label>
                  <NomInputs
                    {...formRegister("streetNumber", {
                      required: "A házszám kötelező",
                    })}
                    type="text"
                    placeholder="42"
                    isInvalid={!!errors.streetNumber}
                  />
                  {errors.streetNumber && (
                    <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                      {errors.streetNumber.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.city}>
                  <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                    Város
                  </Field.Label>
                  <NomInputs
                    {...formRegister("city", {
                      required: "A város kötelező",
                    })}
                    type="text"
                    placeholder="Budapest"
                    isInvalid={!!errors.city}
                  />
                  {errors.city && (
                    <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                      {errors.city.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.zipCode}>
                  <Field.Label fontWeight="700" color={yellow} fontSize="sm">
                    Irányítószám
                  </Field.Label>
                  <NomInputs
                    {...formRegister("zipCode", {
                      required: "Az irányítószám kötelező",
                      pattern: {
                        value: /^[0-9]{4}$/,
                        message: "Érvénytelen irányítószám (4 számjegy)",
                      },
                    })}
                    type="text"
                    placeholder="1234"
                    isInvalid={!!errors.zipCode}
                  />
                  {errors.zipCode && (
                    <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
                      {errors.zipCode.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                {userType === "restaurant" && (
                  <>
                    <Field.Root invalid={!!errors.startTime}>
                      <Field.Label
                        fontWeight="700"
                        color={yellow}
                        fontSize="sm"
                      >
                        Nyitás
                      </Field.Label>
                      <NomInputs
                        {...formRegister("startTime", {
                          required: "A nyitás ideje kötelező",
                        })}
                        type="time"
                        placeholder="09:00"
                        isInvalid={!!errors.startTime}
                      />
                      {errors.startTime && (
                        <Field.ErrorText
                          fontSize="sm"
                          color="red.500"
                          mt="0.5rem"
                        >
                          {errors.startTime.message}
                        </Field.ErrorText>
                      )}
                    </Field.Root>

                    <Field.Root invalid={!!errors.endTime}>
                      <Field.Label
                        fontWeight="700"
                        color={yellow}
                        fontSize="sm"
                      >
                        Zárás
                      </Field.Label>
                      <NomInputs
                        {...formRegister("endTime", {
                          required: "A zárás ideje kötelező",
                        })}
                        type="time"
                        placeholder="22:00"
                        isInvalid={!!errors.endTime}
                      />
                      {errors.endTime && (
                        <Field.ErrorText
                          fontSize="sm"
                          color="red.500"
                          mt="0.5rem"
                        >
                          {errors.endTime.message}
                        </Field.ErrorText>
                      )}
                    </Field.Root>
                  </>
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
