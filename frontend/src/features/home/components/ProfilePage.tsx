import {
  Box,
  Container,
  Text,
  VStack,
  SimpleGrid,
  Spinner,
  Textarea,
  Field,
} from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { User, Mail, MapPin, Phone } from "lucide-react";
import { purple, pink, yellow, lightPurple } from "../../common/theme/colorScheme";
import { NomButtons } from "../../common/components/NomButton";
import { NomInputs } from "../../common/components/NomInput";
import { Footer } from "../../common/components/Footer";
import { useQueryClient } from "@tanstack/react-query";

const mockToaster = {
    success: (message: string) => console.log(`SUCCESS: ${message}`),
    error: (message: string) => console.error(`ERROR: ${message}`),
};

import { useGetUserProfile, useUpdateUserProfile } from "../api/useProfileQueries";
import type { UpdateUserProfileRequest, GetUserProfileResponse } from "../api/profileapi.types";

interface FormFieldProps {
  label: string;
  name: keyof UpdateUserProfileRequest;
  children: React.ReactNode;
  error: any;
}

const FormField = ({ label, children, error }: FormFieldProps) => (
  <Field.Root invalid={!!error}>
    <Field.Label color="white" fontWeight="600" fontSize="sm" mb="0.5rem">
      {label}
    </Field.Label>
    {children}
    {error && (
      <Field.ErrorText fontSize="sm" color="red.500" mt="0.5rem">
        {error.message}
      </Field.ErrorText>
    )}
  </Field.Root>
);

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useGetUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, 
  } = useForm<UpdateUserProfileRequest>({
    
    values: data ? {
        id: data.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        zipCode: data.zipCode,
        city: data.city,
        street: data.street,
        streetNumber: data.streetNumber,
        description: data.description ?? "", 
    } : undefined, 
  });

  const onSubmit: SubmitHandler<UpdateUserProfileRequest> = async (formData) => {

    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        mockToaster.success("Profil sikeresen frissítve!");
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      },
      onError: (err) => {
        console.error("Profile update failed:", err);
        mockToaster.error("Profilfrissítés sikertelen. Próbálja újra.");
      },
    });
  };

  const roleLabel: Record<
    GetUserProfileResponse["role"],
    string
  > = {
    CUSTOMER: "Vásárló",
    RESTAURANT: "Étterem",
    COURIER: "Futár",
    ADMIN: "Adminisztrátor",
    UNKNOWN: "Ismeretlen",
  };
  
  const isUpdating = updateProfileMutation.isPending;

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.900"
      >
        <Spinner size="xl" color={yellow} />
      </Box>
    );
  }

  if (isError) {
    return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          bg="gray.900"
          color="white"
          p="4"
        >
            <Text fontSize="2xl" color="red.500" mb="4">Hiba történt a profil betöltésekor</Text>
            <Text>{error.message}</Text>
        </Box>
    );
  }

  const profile = data!; 

  const generalFields = [
    {
      label: "Név / Étterem neve",
      name: "name" as const,
      icon: User,
      rules: { required: "A név megadása kötelező" },
    },
    {
      label: "Email cím",
      name: "email" as const,
      icon: Mail,
      rules: {
        required: "Az email cím megadása kötelező",
        pattern: {
          value: /^\S+@\S+$/i,
          message: "Érvénytelen email formátum",
        },
      },
      isDisabled: true, 
    },
    {
      label: "Telefonszám",
      name: "phoneNumber" as const,
      icon: Phone,
      rules: { required: "A telefonszám megadása kötelező" },
    },
  ];

  const addressFields = [
    {
      label: "Irányítószám",
      name: "zipCode" as const,
      rules: { required: "Az irányítószám megadása kötelező" },
    },
    {
      label: "Város",
      name: "city" as const,
      rules: { required: "A város megadása kötelező" },
    },
    {
      label: "Utca",
      name: "street" as const,
      rules: { required: "Az utca megadása kötelező" },
    },
    {
      label: "Házszám",
      name: "streetNumber" as const,
      rules: { required: "A házszám megadása kötelező" },
    },
  ];

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bg="gray.900"
      py={{ base: "4rem", md: "8rem" }}
    >
      <Container maxW="3xl" position="relative" zIndex={1}>
        <VStack gap="2rem" w="full">
          <Box
            p={{ base: "1.5rem", md: "2.5rem" }}
            bg={purple}
            borderRadius="xl"
            boxShadow={`0 10px 40px ${purple}80`}
            w="full"
          >
            <VStack mb="2rem" gap="0.5rem" textAlign="center">
              <Text fontSize="3xl" fontWeight="800" color={yellow}>
                Profil beállítások
              </Text>
              <Text fontSize="md" color="whiteAlpha.800">
                Tekintse meg és frissítse profiladatait.
              </Text>
              <Text
                fontSize="sm"
                fontWeight="700"
                color={pink}
                mt="0.5rem"
                p="0.25rem 0.75rem"
                borderRadius="full"
                bg={`${pink}20`}
              >
                Szerepkör: {roleLabel[profile.role]}
              </Text>
            </VStack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap="1rem" align="stretch">
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color={yellow}
                  borderBottom="2px solid"
                  borderColor={`${yellow}30`}
                  pb="0.5rem"
                  mt="1rem"
                >
                  Általános adatok
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="1rem">
                  {generalFields.map((field) => (
                    <FormField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      error={errors[field.name]}
                    >
                      <NomInputs
                        {...register(field.name, field.rules)}
                        placeholder={field.label}
                        startElement={
                          field.icon ? <field.icon size={20} /> : null
                        }
                        isInvalid={!!errors[field.name]}
                        isDisabled={field.isDisabled || isUpdating}
                      />
                    </FormField>
                  ))}
                </SimpleGrid>

                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color={yellow}
                  borderBottom="2px solid"
                  borderColor={`${yellow}30`}
                  pb="0.5rem"
                  mt="1.5rem"
                >
                  Cím adatok
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="1rem">
                  {addressFields.map((field) => (
                    <FormField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      error={errors[field.name]}
                    >
                      <NomInputs
                        {...register(field.name, field.rules)}
                        placeholder={field.label}
                        startElement={<MapPin size={20} />}
                        isInvalid={!!errors[field.name]}
                        isDisabled={isUpdating}
                      />
                    </FormField>
                  ))}
                </SimpleGrid>

                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color={yellow}
                  borderBottom="2px solid"
                  borderColor={`${yellow}30`}
                  pb="0.5rem"
                  mt="1.5rem"
                >
                  Rövid leírás
                </Text>
                <FormField
                  label=""
                  name="description"
                  error={errors.description}
                >
                  <Textarea
                    {...register("description")}
                    placeholder="Írj egy rövid leírást magadról vagy az éttermedről..."
                    _placeholder={
                        {
                            color: yellow
                        }
                    }
                    color="white"
                    borderRadius="lg"
                    borderColor={`${lightPurple}40`}
                    _focus={{
                      borderColor: pink,
                      boxShadow: `0 0 0 3px ${pink}15`,
                    }}
                    minHeight="100px"
                  />
                </FormField>

                <NomButtons
                  title={
                    isUpdating
                      ? "Frissítés..."
                      : isDirty
                      ? "Profil frissítése"
                      : "Nincs változás"
                  }
                  type="submit"
                  colorScheme={isDirty ? "primary" : "secondary"}
                  w="full"
                  h="3rem"
                  fontSize="md"
                  fontWeight="700"
                  borderRadius="lg"
                  disabled={isUpdating || !isDirty} 
                  mt="2rem"
                />
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
     <Footer />
    </Box>
  );
}