import { Button, HStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { purple, yellow, lightPurple, pink } from "../theme/colorScheme";

interface NomButtonProps {
  title: string;
  variant?: "solid" | "outline" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  colorScheme?: "primary" | "secondary" | "accent" | "outline";
  startElement?: ReactNode;
  w?: string;
  h?: string;
  [key: string]: any;
}

export function NomButtons({
  title,
  onClick,
  variant = "solid",
  type = "button",
  colorScheme = "primary",
  startElement,
  ...props
}: NomButtonProps) {
  const colorSchemes = {
    primary: {
      bg: yellow,
      color: "black",
      hoverBg: `${yellow}E6`,
      shadowColor: "rgba(69, 6, 147, 0.25)",
      borderColor: "transparent",
    },
    secondary: {
      bg: lightPurple,
      color: "white",
      hoverBg: `${lightPurple}E6`,
      shadowColor: "rgba(140, 0, 255, 0.25)",
      borderColor: "transparent",
    },
    accent: {
      bg: pink,
      color: "white",
      hoverBg: `${pink}E6`,
      shadowColor: "rgba(255, 63, 127, 0.25)",
      borderColor: "transparent",
    },
    outline: {
      bg: "transparent",
      color: "yellow",
      hoverBg: `${yellow}20`,
      shadowColor: "rgba(69, 6, 147, 0.15)",
      borderColor: `${yellow}`,
    },
  };

  const scheme = colorSchemes[colorScheme];

  return (
    <Button
      bg={scheme.bg}
      color={scheme.color}
      size="lg"
      px="2rem"
      fontWeight="700"
      onClick={onClick}
      variant={variant}
      borderColor={scheme.borderColor}
      type={type}
      _hover={{
        bg: scheme.hoverBg,
        transform: "translateY(-2px)",
        shadow: `0 8px 20px ${scheme.shadowColor}`,
      }}
      _active={{
        transform: "translateY(0)",
      }}
      transition="all 0.3s"
      {...props}
    >
      <HStack gap="2">
        {startElement && startElement}
        <span>{title}</span>
      </HStack>
    </Button>
  );
}
