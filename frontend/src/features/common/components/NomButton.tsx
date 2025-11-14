import { Button } from "@chakra-ui/react";
import { purple, yellow } from "../theme/colorScheme";

interface NomButtonProps {
  title: string;
  variant: "solid" | "outline" | "ghost";
  onClick: () => void;
}

export function NomButtons({ title, onClick, variant }: NomButtonProps) {
  return (
    <Button
      bg={purple}
      color={yellow}
      size="md"
      onClick={onClick}
      variant={variant}
    >
      {title}
    </Button>
  );
}
