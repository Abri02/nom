import React, { type ReactNode } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { purple, yellow, lightPurple, pink } from "../theme/colorScheme";
import { NomButtons } from "./NomButton";

type NomButtonColorScheme = "primary" | "secondary" | "accent" | "outline";

interface NomPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  icon?: ReactNode;
  confirmButtonTitle: string;
  confirmColorScheme?: NomButtonColorScheme;
  isSubmitting?: boolean;
  cancelButtonTitle?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function NomPopUp({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  confirmButtonTitle,
  confirmColorScheme = "accent",
  isSubmitting = false,
  cancelButtonTitle,
  size = "md",
}: NomPopUpProps) {
  const headerAccentColor = {
    primary: yellow,
    secondary: lightPurple,
    accent: pink,
    outline: yellow,
  }[confirmColorScheme];

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => (!e.open ? onClose() : null)} size={size}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg={purple}
            borderRadius="xl"
            boxShadow={`0 10px 40px ${purple}80`}
            p={{ base: 2, md: 4 }}
          >
            <Dialog.Header
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color={headerAccentColor}
              borderBottom="1px solid"
              borderColor={`${headerAccentColor}30`}
              pb={3}
              display="flex"
              alignItems="center"
              gap={3}
              mb={4}
            >
              {icon}
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body color="whiteAlpha.800" pt={2} pb={6}>
              <VStack align="stretch" gap={4}>{description}</VStack>
            </Dialog.Body>

            <Dialog.Footer display="flex" gap={3} justifyContent="flex-end">
              <Dialog.ActionTrigger asChild>

                 <NomButtons
                 colorScheme="secondary"
               flex={1} 
               title={cancelButtonTitle} >
              </NomButtons>
                
              </Dialog.ActionTrigger>

              <NomButtons
                title={isSubmitting ? "Készül..." : confirmButtonTitle}
                onClick={onConfirm}
                colorScheme={confirmColorScheme}
                disabled={isSubmitting}
                h="2.75rem"
                borderRadius="lg"
                w={{ base: "50%", md: "auto" }}
                isLoading={isSubmitting}
              />
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color={yellow} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}