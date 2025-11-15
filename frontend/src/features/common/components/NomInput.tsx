import { Input, Box } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { lightPurple, pink, yellow } from "../theme/colorScheme";

interface NomInputsProps {
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startElement?: ReactNode;
  endElement?: ReactNode;
  isInvalid?: boolean;
  colorScheme?: "primary" | "secondary" | "accent";
  [key: string]: any;
}

export function NomInputs({
  placeholder = "",
  type = "text",
  value,
  onChange,
  startElement,
  endElement,
  isInvalid = false,
  colorScheme = "primary",
  ...props
}: NomInputsProps) {
  const colorSchemes = {
    primary: {
      iconColor: yellow,
      focusBorderColor: yellow,
      focusShadow: `0 0 0 3px ${yellow}20`,
    },
    secondary: {
      iconColor: lightPurple,
      focusBorderColor: lightPurple,
      focusShadow: `0 0 0 3px ${lightPurple}20`,
    },
    accent: {
      iconColor: pink,
      focusBorderColor: pink,
      focusShadow: `0 0 0 3px ${pink}15`,
    },
  };

  const scheme = colorSchemes[colorScheme];

  return (
    <Box position="relative">
      {startElement && (
        <Box
          position="absolute"
          left="1rem"
          top="50%"
          transform="translateY(-50%)"
          color={scheme.iconColor}
          display="flex"
          alignItems="center"
          pointerEvents="none"
        >
          {startElement}
        </Box>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        
        value={value}
        onChange={onChange}
        color={scheme.iconColor}
        borderRadius="lg"
        borderColor={isInvalid ? "red.500" : scheme.focusBorderColor}
        _focus={{
          borderColor: isInvalid ? "red.500" : scheme.focusBorderColor,
          boxShadow: isInvalid ? "0 0 0 3px rgba(245, 101, 101, 0.1)" : scheme.focusShadow,
        }}
        _placeholder={{ color: scheme.iconColor, opacity: 0.6 }}
        ps={startElement ? "3rem" : "1rem"}
        pe={endElement ? "3rem" : "1rem"}
        h="2.75rem"
        transition="all 0.2s"
        {...props}
      />
      {endElement && (
        <Box
          position="absolute"
          right="1rem"
          top="50%"
          transform="translateY(-50%)"
          color={scheme.iconColor}
          display="flex"
          alignItems="center"
          pointerEvents="none"
        >
          {endElement}
        </Box>
      )}
    </Box>
  );
}
