import { Button } from "@chakra-ui/react";
import { purple, yellow } from "../theme/colorScheme";

interface NomButtonProps {
  title: string;
  variant?: "solid" | "outline" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  w?: string;
  h?: string;
  [key: string]: any;
}

export function NomButtons({
  title,
  onClick,
  variant = "solid",
  type = "button",
  ...props
}: NomButtonProps) {
  return (
    <Button
      bg={yellow}
      color={purple}
      size="md"
      onClick={onClick}
      variant={variant}
      type={type}
      _hover={{
        bg: `${yellow}E6`,
        transform: "translateY(-2px)",
        shadow: "0 8px 20px rgba(69, 6, 147, 0.25)",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      transition="all 0.2s"
      {...props}
    >
      {title}
    </Button>
  );
}
